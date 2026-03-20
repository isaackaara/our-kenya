document.addEventListener("nav", () => {
  const container = document.getElementById("ok-listen")
  if (!container) return

  const article = document.querySelector("article")
  if (!article) return

  // Hide on homepage, folder indexes, tags, and special pages
  const path = window.location.pathname.replace(/\/$/, "")
  if (path === "" || path === "/STORY-TRAILS" || path === "/contribute" || path === "/support" || path.startsWith("/tags")) {
    container.style.display = "none"
    return
  }

  const contentEl = article.querySelector(".article-body") ?? article.querySelector("#quartz-body") ?? article
  if (!contentEl) return

  const btn = container.querySelector(".ok-listen-btn") as HTMLButtonElement
  const stopBtn = container.querySelector(".ok-listen-stop") as HTMLButtonElement
  const playIcon = container.querySelector(".ok-listen-icon-play") as SVGElement
  const pauseIcon = container.querySelector(".ok-listen-icon-pause") as SVGElement
  const label = container.querySelector(".ok-listen-label") as HTMLSpanElement

  if (!btn || !stopBtn || !playIcon || !pauseIcon || !label) return
  container.style.display = ""

  const synth = window.speechSynthesis
  let speaking = false
  let paused = false
  let wordSpans: HTMLSpanElement[] = []
  let originalNodes: { parent: Node; nodes: Node[] }[] = []

  // ── Word wrapping ──────────────────────────────────────────
  // Walk text nodes in the content area, wrap each word in a <span>,
  // and build a char-offset → span mapping for highlight sync.

  const getReadableNodes = (): Node[] => {
    const nodes: Node[] = []
    const walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT)
    let node: Node | null
    while ((node = walker.nextNode())) {
      // Skip See Also / Sources sections
      const parent = node.parentElement
      if (parent) {
        let el: Element | null = parent
        let skip = false
        while (el && el !== contentEl) {
          if (el.tagName?.match(/^H[2-6]$/)) {
            const t = el.textContent?.trim().toLowerCase() ?? ""
            if (t === "see also" || t === "sources") { skip = true; break }
          }
          el = el.parentElement
        }
        if (skip) continue
        // Check if this text node comes after a See Also / Sources heading
        const headings = contentEl.querySelectorAll("h2, h3, h4, h5, h6")
        let afterCutoff = false
        for (const h of headings) {
          const ht = h.textContent?.trim().toLowerCase() ?? ""
          if ((ht === "see also" || ht === "sources") &&
              node.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_PRECEDING) {
            afterCutoff = true
            break
          }
        }
        if (afterCutoff) continue
      }
      if (node.textContent?.trim()) nodes.push(node)
    }
    return nodes
  }

  const wrapWords = (): { text: string; charToSpan: Map<number, HTMLSpanElement> } => {
    wordSpans = []
    originalNodes = []
    const charToSpan = new Map<number, HTMLSpanElement>()
    let charOffset = 0
    const textParts: string[] = []

    const textNodes = getReadableNodes()

    for (const textNode of textNodes) {
      const raw = textNode.textContent ?? ""
      const parent = textNode.parentNode
      if (!parent) continue

      // Save original state for unwrapping
      const frag = document.createDocumentFragment()
      const savedNodes: Node[] = []

      // Split into words and whitespace
      const parts = raw.match(/\S+|\s+/g) || []
      for (const part of parts) {
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part))
          charOffset += part.length
          textParts.push(part)
        } else {
          const span = document.createElement("span")
          span.textContent = part
          span.className = "ok-word"
          frag.appendChild(span)
          wordSpans.push(span)
          charToSpan.set(charOffset, span)
          charOffset += part.length
          textParts.push(part)
        }
      }

      // Replace original text node with wrapped spans
      savedNodes.push(textNode.cloneNode(true))
      originalNodes.push({ parent, nodes: savedNodes })
      parent.replaceChild(frag, textNode)
    }

    return { text: textParts.join(""), charToSpan }
  }

  const unwrapWords = () => {
    // Remove highlights
    const highlighted = contentEl.querySelectorAll(".ok-word")
    highlighted.forEach((span) => {
      const text = document.createTextNode(span.textContent ?? "")
      span.parentNode?.replaceChild(text, span)
    })
    // Normalize to merge adjacent text nodes
    contentEl.normalize()
    wordSpans = []
    originalNodes = []
  }

  let currentHighlight: HTMLSpanElement | null = null
  let charToSpanMap = new Map<number, HTMLSpanElement>()

  const clearHighlight = () => {
    if (currentHighlight) {
      currentHighlight.classList.remove("ok-word-active")
      currentHighlight = null
    }
  }

  // ── UI ─────────────────────────────────────────────────────

  const updateUI = () => {
    if (speaking && !paused) {
      playIcon.style.display = "none"
      pauseIcon.style.display = ""
      label.textContent = "Pause"
      stopBtn.style.display = ""
    } else if (speaking && paused) {
      playIcon.style.display = ""
      pauseIcon.style.display = "none"
      label.textContent = "Resume"
      stopBtn.style.display = ""
    } else {
      playIcon.style.display = ""
      pauseIcon.style.display = "none"
      label.textContent = "Listen"
      stopBtn.style.display = "none"
    }
  }

  const stop = () => {
    synth.cancel()
    speaking = false
    paused = false
    clearHighlight()
    unwrapWords()
    updateUI()
  }

  const speak = () => {
    const { text, charToSpan } = wrapWords()
    charToSpanMap = charToSpan
    if (!text) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0

    const voices = synth.getVoices()
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Samantha") || v.name.includes("Google") || v.name.includes("Natural")),
    )
    const fallback = voices.find((v) => v.lang.startsWith("en"))
    if (preferred) utterance.voice = preferred
    else if (fallback) utterance.voice = fallback

    utterance.onboundary = (e: SpeechSynthesisEvent) => {
      if (e.name !== "word") return
      clearHighlight()

      // Find the span at this char offset
      const span = charToSpanMap.get(e.charIndex)
      if (span) {
        span.classList.add("ok-word-active")
        currentHighlight = span

        // Scroll into view if off-screen
        const rect = span.getBoundingClientRect()
        const viewH = window.innerHeight
        if (rect.top < 80 || rect.bottom > viewH - 40) {
          span.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    }

    utterance.onend = () => {
      speaking = false
      paused = false
      clearHighlight()
      unwrapWords()
      updateUI()
    }

    utterance.onerror = () => {
      speaking = false
      paused = false
      clearHighlight()
      unwrapWords()
      updateUI()
    }

    synth.speak(utterance)
    speaking = true
    paused = false
    updateUI()
  }

  btn.addEventListener("click", () => {
    if (!speaking) {
      speak()
    } else if (paused) {
      synth.resume()
      paused = false
      updateUI()
    } else {
      synth.pause()
      paused = true
      updateUI()
    }
  })

  stopBtn.addEventListener("click", stop)

  if (typeof window.addCleanup === "function") {
    window.addCleanup(() => {
      stop()
    })
  }
})
