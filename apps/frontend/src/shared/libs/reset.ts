const resets: Array<() => void> = []

export const registerReset = (reset: () => void) => {
  resets.push(reset)
}

export const resetAll = () => {
  for (const reset of resets) reset()
}
