const STORAGE_KEY = "dailo.sound"

let context: AudioContext | null = null

export function isSoundEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off"
  } catch {
    return true
  }
}

export function setSoundEnabled(enabled: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off")
  } catch {
    return
  }
}

function getContext() {
  if (typeof window === "undefined") return null
  const Context = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Context) return null
  context ??= new Context()
  if (context.state === "suspended") void context.resume()
  return context
}

function tone(audio: AudioContext, frequency: number, start: number, duration: number, volume: number) {
  const oscillator = audio.createOscillator()
  const gain = audio.createGain()
  oscillator.type = "sine"
  oscillator.frequency.setValueAtTime(frequency, start)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain).connect(audio.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.02)
}

export function playComplete() {
  if (!isSoundEnabled()) return
  const audio = getContext()
  if (!audio) return
  const now = audio.currentTime
  tone(audio, 659.25, now, 0.14, 0.09)
  tone(audio, 987.77, now + 0.075, 0.22, 0.08)
}
