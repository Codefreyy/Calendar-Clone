import { ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"

export type ModalProps = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
}

export function Modal({ children, isOpen, onClose }: ModalProps) {
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

  if (!isOpen) return null

  return createPortal(
    <div className="modal">
      <div className="overlay" onClick={onClose}></div>
      <div className="modal-body">{children}</div>
    </div>,
    document.querySelector("#modal-container") as HTMLElement
  )
}
