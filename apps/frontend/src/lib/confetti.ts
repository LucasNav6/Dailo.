const COLORS = ["#e5472c", "#1e3329", "#3f5a4b", "#f2b84b", "#7fb069", "#dce7d5"]

export function confetti(origin: Element, count = 22) {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const rect = origin.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2

  for (let index = 0; index < count; index++) {
    const piece = document.createElement("span")
    const size = 5 + Math.random() * 5
    piece.setAttribute("aria-hidden", "true")
    Object.assign(piece.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size * (Math.random() > 0.5 ? 1 : 0.5)}px`,
      background: COLORS[index % COLORS.length],
      borderRadius: Math.random() > 0.6 ? "50%" : "1px",
      pointerEvents: "none",
      zIndex: "100",
    })
    document.body.appendChild(piece)

    const angle = Math.random() * Math.PI * 2
    const distance = 40 + Math.random() * 70
    const dx = Math.cos(angle) * distance
    const dy = Math.sin(angle) * distance - 30
    const spin = (Math.random() - 0.5) * 720
    piece
      .animate(
        [
          { transform: "translate(-50%, -50%) rotate(0deg)", opacity: 1 },
          { transform: `translate(${dx - size / 2}px, ${dy}px) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.55 },
          { transform: `translate(${dx - size / 2}px, ${dy + 70}px) rotate(${spin}deg)`, opacity: 0 },
        ],
        { duration: 750 + Math.random() * 350, easing: "cubic-bezier(.2,.7,.3,1)" }
      )
      .finished.then(() => piece.remove())
      .catch(() => piece.remove())
  }
}
