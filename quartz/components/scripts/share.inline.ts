document.addEventListener("nav", () => {
  const shareContainers = document.querySelectorAll(".share-container")

  shareContainers.forEach((container) => {
    const shareButton = container.querySelector(".share-button") as HTMLButtonElement
    const fallback = container.querySelector(".share-fallback") as HTMLElement
    const feedback = container.querySelector(".share-feedback") as HTMLElement
    const copyButton = container.querySelector(".copy-link") as HTMLButtonElement
    const whatsappLink = container.querySelector(".whatsapp") as HTMLAnchorElement
    const twitterLink = container.querySelector(".twitter") as HTMLAnchorElement

    if (!shareButton) return

    const title = shareButton.dataset.title || "Our Kenya"
    const url = shareButton.dataset.url || window.location.href
    
    // Determine share text based on slug
    let shareText: string
    if (url.includes("/STORY-TRAILS")) {
      shareText = `Story Trails - follow a thread through Kenya's history | Our Kenya`
    } else if (url.endsWith("ourkenya.com/") || url.endsWith("ourkenya.com")) {
      shareText = "Our Kenya - Kenya's story, still being written"
    } else {
      shareText = `${title} | Our Kenya`
    }

    // Set up fallback URLs
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + url)}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`
    
    if (whatsappLink) whatsappLink.href = whatsappUrl
    if (twitterLink) twitterLink.href = twitterUrl

    const handleShare = async () => {
      // Try Web Share API first (mobile/supported browsers)
      if (navigator.share) {
        try {
          await navigator.share({
            title: shareText,
            url: url,
          })
        } catch (err) {
          // User cancelled or share failed, ignore
          if (err instanceof Error && err.name !== "AbortError") {
            console.error("Share failed:", err)
          }
        }
      } else {
        // Desktop fallback: show inline buttons
        if (fallback) {
          fallback.classList.toggle("hidden")
        }
      }
    }

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(url)
        if (feedback) {
          feedback.classList.remove("hidden")
          setTimeout(() => {
            feedback.classList.add("hidden")
          }, 2000)
        }
      } catch (err) {
        console.error("Copy failed:", err)
      }
    }

    shareButton.addEventListener("click", handleShare)
    if (copyButton) {
      copyButton.addEventListener("click", handleCopy)
    }

    window.addCleanup(() => {
      shareButton.removeEventListener("click", handleShare)
      if (copyButton) {
        copyButton.removeEventListener("click", handleCopy)
      }
    })
  })
})
