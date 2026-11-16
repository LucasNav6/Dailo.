import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"

export type DragTarget = { group: string; index: number }
export type DragState = { id: string; group: string; offset: number }

type Box = { top: number; bottom: number }

type Options = {
  onDrop: (id: string, from: string, target: DragTarget) => void
}

const EDGE = 64
const SPEED = 14

function scrollParent(element: HTMLElement) {
  return (element.closest("main") as HTMLElement | null) ?? (document.scrollingElement as HTMLElement)
}

export function useDragSort({ onDrop }: Options) {
  const [drag, setDrag] = useState<DragState | null>(null)
  const [target, setTarget] = useState<DragTarget | null>(null)
  const rows = useRef(new Map<string, { element: HTMLElement; group: string }>())
  const groups = useRef(new Map<string, HTMLElement>())
  const onDropRef = useRef(onDrop)
  onDropRef.current = onDrop
  const cancel = useRef<(() => void) | null>(null)

  const rowRef = useCallback(
    (id: string, group: string) => (element: HTMLElement | null) => {
      if (element) rows.current.set(id, { element, group })
      else rows.current.delete(id)
    },
    []
  )

  const groupRef = useCallback(
    (group: string) => (element: HTMLElement | null) => {
      if (element) groups.current.set(group, element)
      else groups.current.delete(group)
    },
    []
  )

  const start = useCallback((id: string, group: string, event: ReactPointerEvent) => {
    if (event.button !== undefined && event.button !== 0) return
    const origin = rows.current.get(id)
    if (!origin) return
    event.preventDefault()
    const scroller = scrollParent(origin.element)
    const toContent = (clientY: number) => clientY - scroller.getBoundingClientRect().top + scroller.scrollTop
    const measure = (element: HTMLElement): Box => {
      const rect = element.getBoundingClientRect()
      const top = rect.top - scroller.getBoundingClientRect().top + scroller.scrollTop
      return { top, bottom: top + rect.height }
    }

    const rowBoxes = new Map<string, { box: Box; group: string }>()
    rows.current.forEach(({ element, group: rowGroup }, rowId) => {
      if (rowId !== id) rowBoxes.set(rowId, { box: measure(element), group: rowGroup })
    })
    const groupBoxes = new Map<string, Box>()
    groups.current.forEach((element, groupId) => groupBoxes.set(groupId, measure(element)))

    const startY = toContent(event.clientY)
    const grab = startY - measure(origin.element).top
    let lastOffset = 0
    let clientY = event.clientY
    let current: DragTarget | null = { group, index: 0 }
    let frame = 0
    let active = true

    const compute = () => {
      const y = toContent(clientY)
      let chosen = group
      if (groupBoxes.size > 0) {
        let best = Infinity
        groupBoxes.forEach((box, groupId) => {
          const distance = y < box.top ? box.top - y : y > box.bottom ? y - box.bottom : 0
          if (distance < best) {
            best = distance
            chosen = groupId
          }
        })
      }
      let index = 0
      rowBoxes.forEach(({ box, group: rowGroup }) => {
        if (rowGroup === chosen && (box.top + box.bottom) / 2 < y) index++
      })
      current = { group: chosen, index }
      setTarget(current)
      const natural = measure(origin.element).top - lastOffset
      lastOffset = y - grab - natural
      setDrag({ id, group, offset: lastOffset })
    }

    const tick = () => {
      if (!active) return
      const rect = scroller.getBoundingClientRect()
      if (clientY < rect.top + EDGE) scroller.scrollTop -= SPEED
      else if (clientY > rect.bottom - EDGE) scroller.scrollTop += SPEED
      compute()
      frame = requestAnimationFrame(tick)
    }

    const move = (moveEvent: PointerEvent) => {
      clientY = moveEvent.clientY
    }
    const finish = (commit: boolean) => {
      active = false
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", abort)
      window.removeEventListener("keydown", key)
      cancel.current = null
      const result = current
      setDrag(null)
      setTarget(null)
      if (commit && result) onDropRef.current(id, group, result)
    }
    const up = () => finish(true)
    const abort = () => finish(false)
    const key = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") finish(false)
    }

    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
    window.addEventListener("pointercancel", abort)
    window.addEventListener("keydown", key)
    cancel.current = () => finish(false)
    setDrag({ id, group, offset: 0 })
    setTarget(current)
    frame = requestAnimationFrame(tick)
  }, [])

  useEffect(() => () => cancel.current?.(), [])

  return { drag, target, rowRef, groupRef, start }
}
