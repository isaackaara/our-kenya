document.addEventListener("nav", () => {
  const container = document.getElementById("ok-listen")
  if (!container) return

  const article = document.querySelector("article")
  if (!article) return

  // Hide on non-note pages (special pages, hubs, stubs, indexes)
  const path = window.location.pathname.replace(/\/$/, "")
  const nonNotePages = [
    "", "/STORY-TRAILS", "/contribute", "/support", "/stats",
    "/games", "/games/daily-trivia", "/games/timeline",
    "/Kenya", "/Agriculture", "/Asians", "/Economy", "/explore",
    "/Geography", "/Government", "/Gusii", "/Infrastructure",
    "/KANU", "/Policy", "/Politics", "/Regional-Integration",
    "/Startups", "/Tourism", "/Transportation", "/Turkana",
  ]
  if (
    nonNotePages.includes(path) ||
    path.startsWith("/tags") ||
    path.startsWith("/explore/") ||
    path.startsWith("/Trails/")
  ) {
    container.style.display = "none"
    return
  }

  // Target the actual markdown content — article.popover-hint contains only the note text
  const contentEl = document.querySelector("article.popover-hint") ?? article
  if (!contentEl) return

  // ── DOM refs ────────────────────────────────────────────────
  const listenBtn = container.querySelector(".ok-listen-btn") as HTMLButtonElement
  const playIcon = container.querySelector(".ok-listen-icon-play") as SVGElement
  const label = container.querySelector(".ok-listen-label") as HTMLSpanElement

  const loadingEl = container.querySelector(".ok-listen-loading") as HTMLDivElement

  const player = container.querySelector(".ok-listen-player") as HTMLDivElement
  const playerPlay = container.querySelector(".ok-player-play") as HTMLButtonElement
  const playerPause = container.querySelector(".ok-player-pause") as HTMLButtonElement
  const playerBack = container.querySelector(".ok-player-back") as HTMLButtonElement
  const playerFwd = container.querySelector(".ok-player-fwd") as HTMLButtonElement
  const seekBar = container.querySelector(".ok-player-seek") as HTMLInputElement
  const timeDisplay = container.querySelector(".ok-player-time") as HTMLSpanElement
  const playerStop = container.querySelector(".ok-player-stop") as HTMLButtonElement

  const resumePrompt = container.querySelector(".ok-listen-resume") as HTMLDivElement
  const resumeText = container.querySelector(".ok-resume-text") as HTMLSpanElement
  const resumeYes = container.querySelector(".ok-resume-yes") as HTMLButtonElement
  const resumeNo = container.querySelector(".ok-resume-no") as HTMLButtonElement

  const audio = container.querySelector(".ok-listen-audio") as HTMLAudioElement

  if (!listenBtn || !player || !audio || !seekBar || !timeDisplay) return
  container.style.display = ""

  // ── State ───────────────────────────────────────────────────
  let blobUrl: string | null = null
  let positionSaveInterval: ReturnType<typeof setInterval> | null = null
  let seeking = false
  let prefetchPromise: Promise<Blob> | null = null
  let prefetchedText: string | null = null
  let prefetchedBlob: Blob | null = null // set when prefetch resolves
  const slug = path.replace(/^\//, "")

  // Anonymous listener ID for analytics (no PII)
  const getListenerId = (): string => {
    const key = "ok-listener-id"
    let id = localStorage.getItem(key)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(key, id)
    }
    return id
  }

  // ── Extract article text ────────────────────────────────────
  const getReadableText = (): string => {
    const parts: string[] = []
    const walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT)
    let node: Node | null
    while ((node = walker.nextNode())) {
      const parent = node.parentElement
      if (!parent) continue

      // Skip See Also / Sources sections
      const headings = contentEl.querySelectorAll("h2, h3, h4, h5, h6")
      let afterCutoff = false
      for (const h of headings) {
        const ht = h.textContent?.trim().toLowerCase() ?? ""
        if (
          (ht === "see also" || ht === "sources") &&
          node.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_PRECEDING
        ) {
          afterCutoff = true
          break
        }
      }
      if (afterCutoff) continue

      const text = node.textContent?.trim()
      if (text) parts.push(text)
    }
    return parts.join(" ").replace(/\s+/g, " ").trim()
  }

  // ── Time formatting ─────────────────────────────────────────
  const fmt = (s: number): string => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  // ── Simple content hash ─────────────────────────────────────
  const hashText = (text: string): string => {
    let h = 0
    for (let i = 0; i < text.length; i++) {
      h = ((h << 5) - h + text.charCodeAt(i)) | 0
    }
    return (h >>> 0).toString(36)
  }

  // ── localStorage position ───────────────────────────────────
  const posKey = `ok-listen-pos:${slug}`

  const getSavedPosition = (contentHash: string): number | null => {
    try {
      const raw = localStorage.getItem(posKey)
      if (!raw) return null
      const data = JSON.parse(raw)
      if (data.hash !== contentHash) return null
      return data.time > 2 ? data.time : null
    } catch {
      return null
    }
  }

  const savePosition = (contentHash: string) => {
    if (!audio.duration || audio.paused) return
    try {
      localStorage.setItem(posKey, JSON.stringify({ time: audio.currentTime, hash: contentHash }))
    } catch {}
  }

  const clearPosition = () => {
    try {
      localStorage.removeItem(posKey)
    } catch {}
  }

  // ── UI state transitions ────────────────────────────────────
  const showInitial = () => {
    listenBtn.style.display = ""
    playIcon.style.display = ""
    label.textContent = "Listen"
    listenBtn.disabled = false
    loadingEl.style.display = "none"
    player.style.display = "none"
    resumePrompt.style.display = "none"
  }

  const showLoading = () => {
    listenBtn.style.display = "none"
    loadingEl.style.display = ""
    player.style.display = "none"
    resumePrompt.style.display = "none"
  }

  const showPlayer = () => {
    listenBtn.style.display = "none"
    loadingEl.style.display = "none"
    player.style.display = ""
    resumePrompt.style.display = "none"
  }

  const showResume = (time: number) => {
    listenBtn.style.display = "none"
    loadingEl.style.display = "none"
    player.style.display = "none"
    resumePrompt.style.display = ""
    resumeText.textContent = `Resume from ${fmt(time)}?`
  }

  const updatePlayPause = () => {
    if (audio.paused) {
      playerPlay.style.display = ""
      playerPause.style.display = "none"
    } else {
      playerPlay.style.display = "none"
      playerPause.style.display = ""
    }
  }

  const updateTimeDisplay = () => {
    if (!audio.duration) return
    timeDisplay.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`
    if (!seeking) {
      seekBar.value = String((audio.currentTime / audio.duration) * 100)
    }
  }

  // ── Media Session API ───────────────────────────────────────
  const setupMediaSession = () => {
    if (!("mediaSession" in navigator)) return

    const title =
      document.querySelector("h1.article-title")?.textContent?.trim() ||
      document.title.replace(/ - Our Kenya$/, "")

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: "Our Kenya",
      album: "Our Kenya",
    })

    navigator.mediaSession.setActionHandler("play", () => audio.play())
    navigator.mediaSession.setActionHandler("pause", () => audio.pause())
    navigator.mediaSession.setActionHandler("seekbackward", () => {
      audio.currentTime = Math.max(0, audio.currentTime - 10)
    })
    navigator.mediaSession.setActionHandler("seekforward", () => {
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10)
    })
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime != null) audio.currentTime = details.seekTime
    })
    navigator.mediaSession.setActionHandler("stop", () => stopPlayer())
  }

  // ── Fetch audio (static file or /api/tts fallback) ─────────
  const fetchAudio = async (text: string): Promise<Blob> => {
    // 1. Try static pre-generated MP3 first
    const audioSlug = slug.split("/").pop()!.toLowerCase()
    const staticUrl = `/static/audio/${audioSlug}.mp3`
    try {
      const staticRes = await fetch(staticUrl, { method: "HEAD" })
      if (staticRes.ok) {
        // Static file exists - fetch it
        const res = await fetch(staticUrl)
        if (res.ok) return res.blob()
      }
    } catch {
      // Static file doesn't exist or failed - fall through to API
    }

    // 2. Fallback: generate via /api/tts
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Listener-ID": getListenerId(),
      },
      body: JSON.stringify({ slug, text }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error((errData as any).error || `TTS request failed (${res.status})`)
    }

    return res.blob()
  }

  // ── Prefetch on hover ───────────────────────────────────────
  const prefetch = () => {
    if (prefetchPromise || prefetchedBlob) return // already prefetching or done
    const text = getReadableText()
    if (!text || text.length < 20) return
    prefetchedText = text
    prefetchPromise = fetchAudio(text)
      .then((blob) => {
        prefetchedBlob = blob
        return blob
      })
      .catch(() => {
        prefetchPromise = null
        prefetchedText = null
        prefetchedBlob = null
        return null as any
      })
  }

  listenBtn.addEventListener("mouseenter", prefetch)
  listenBtn.addEventListener("touchstart", prefetch, { passive: true })

  // ── Start playback ─────────────────────────────────────────
  const startPlayback = async (resumeTime?: number) => {
    const text = getReadableText()
    if (!text || text.length < 20) {
      label.textContent = "No content"
      setTimeout(showInitial, 2000)
      return
    }

    const contentHash = hashText(text)

    try {
      let blob: Blob

      if (prefetchedBlob && prefetchedText === text) {
        // Prefetch already done — skip loading state
        blob = prefetchedBlob
      } else {
        // Discard any in-flight prefetch, fetch fresh
        prefetchPromise = null
        prefetchedBlob = null
        showLoading()
        blob = await fetchAudio(text)
      }
      prefetchPromise = null
      prefetchedText = null
      prefetchedBlob = null

      if (blobUrl) URL.revokeObjectURL(blobUrl)
      blobUrl = URL.createObjectURL(blob)
      audio.src = blobUrl

      // Wait for enough data to start playing
      await new Promise<void>((resolve, reject) => {
        audio.oncanplay = () => resolve()
        audio.onerror = () => reject(new Error("Audio failed to load"))
      })

      if (resumeTime && resumeTime < audio.duration - 1) {
        audio.currentTime = resumeTime
      }

      await audio.play()
      showPlayer()
      updatePlayPause()
      updateTimeDisplay()
      setupMediaSession()

      // Save position every 2 seconds
      positionSaveInterval = setInterval(() => savePosition(contentHash), 2000)

      // Audio events
      audio.ontimeupdate = updateTimeDisplay
      audio.onplay = updatePlayPause
      audio.onpause = updatePlayPause
      audio.onended = () => {
        clearPosition()
        stopPlayer()
      }
    } catch (err: any) {
      const textEl = loadingEl.querySelector(".ok-loading-text")
      if (textEl) textEl.textContent = err.message || "Audio failed"
      setTimeout(showInitial, 3000)
    }
  }

  // ── Stop and cleanup ────────────────────────────────────────
  const stopPlayer = () => {
    audio.pause()
    audio.removeAttribute("src")
    audio.load()
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl)
      blobUrl = null
    }
    if (positionSaveInterval) {
      clearInterval(positionSaveInterval)
      positionSaveInterval = null
    }
    audio.ontimeupdate = null
    audio.onplay = null
    audio.onpause = null
    audio.onended = null
    prefetchPromise = null
    prefetchedText = null
    prefetchedBlob = null
    seekBar.value = "0"
    timeDisplay.textContent = "0:00 / 0:00"
    showInitial()
  }

  // ── Event listeners ─────────────────────────────────────────
  listenBtn.addEventListener("click", () => {
    const text = getReadableText()
    const contentHash = hashText(text)
    const savedTime = getSavedPosition(contentHash)

    if (savedTime) {
      showResume(savedTime)
    } else {
      startPlayback()
    }
  })

  resumeYes.addEventListener("click", () => {
    const text = getReadableText()
    const contentHash = hashText(text)
    const savedTime = getSavedPosition(contentHash)
    startPlayback(savedTime ?? undefined)
  })

  resumeNo.addEventListener("click", () => {
    clearPosition()
    startPlayback()
  })

  playerPlay.addEventListener("click", () => audio.play())
  playerPause.addEventListener("click", () => audio.pause())

  playerBack.addEventListener("click", () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10)
  })

  playerFwd.addEventListener("click", () => {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10)
  })

  seekBar.addEventListener("input", () => {
    seeking = true
  })

  seekBar.addEventListener("change", () => {
    if (audio.duration) {
      audio.currentTime = (parseFloat(seekBar.value) / 100) * audio.duration
    }
    seeking = false
  })

  playerStop.addEventListener("click", () => {
    // Save position before stopping
    const text = getReadableText()
    const contentHash = hashText(text)
    if (audio.currentTime > 2 && audio.duration && audio.currentTime < audio.duration - 1) {
      try {
        localStorage.setItem(
          posKey,
          JSON.stringify({ time: audio.currentTime, hash: contentHash }),
        )
      } catch {}
    }
    stopPlayer()
  })

  // ── SPA cleanup ─────────────────────────────────────────────
  if (typeof window.addCleanup === "function") {
    window.addCleanup(() => {
      // Save position before navigating away
      if (!audio.paused && audio.currentTime > 2) {
        const text = getReadableText()
        const contentHash = hashText(text)
        savePosition(contentHash)
      }
      stopPlayer()
    })
  }
})
