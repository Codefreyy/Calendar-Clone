import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { cc } from "../utils/cc"

export type ModalProps = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
}

export function Modal({ children, isOpen, onClose }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false)
  const isPrevOpen = useRef<boolean>()
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key == "Escape") onClose()
    }

    document.addEventListener("keydown", handler)

    // when modal component is unmounted, the return statement will run and this event listener will be removed
    return () => {
      document.removeEventListener("keydown", handler)
    }
  }, [onClose])

  useLayoutEffect(() => {
    if (!isOpen && isPrevOpen.current) {
      setIsClosing(true)
    }

    isPrevOpen.current = isOpen
  }, [isOpen, isPrevOpen])

  if (!isOpen && !isClosing) return null

  return createPortal(
    <div
      // when previous Modal state is open and now it not open, we set "isClosing" to true
      // when the animationEnd, we set isClosing to false and because:
      // if (!isOpen && !isClosing) return null, we close the modal
      onAnimationEnd={() => setIsClosing(false)}
      className={cc("modal", isClosing && "closing")}
    >
      <div className="overlay" onClick={onClose}></div>
      <div className="modal-body">{children}</div>
    </div>,
    document.querySelector("#modal-container") as HTMLElement
  )
}
