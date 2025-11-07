import React, { useRef } from "react"
import { SnippetActions } from "./snippetActions"
import type { DraggableSnippet } from "../types"

type Props = {
  snippet: DraggableSnippet
  onDrag: (id: string, dx: number, dy: number) => void
  onDelete: (snippet: DraggableSnippet) => void
}

export const DraggableSnippetCard: React.FC<Props> = ({ snippet, onDrag, onDelete }) => {
  const posRef = useRef({ x: 0, y: 0, isDragging: false })

  const onMouseDown = (e: React.MouseEvent) => {
    posRef.current = { x: e.clientX, y: e.clientY, isDragging: true }
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!posRef.current.isDragging) return
    const dx = e.clientX - posRef.current.x
    const dy = e.clientY - posRef.current.y
    posRef.current.x = e.clientX
    posRef.current.y = e.clientY
    onDrag(snippet.id, dx, dy)
  }

  const onMouseUp = () => {
    posRef.current.isDragging = false
    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseup", onMouseUp)
  }

  return (
    <div
      className="snippet-card"
      style={{ left: snippet.x, top: snippet.y }}
      onMouseDown={onMouseDown}
    >
      <pre className="snippet-code">{snippet.code}</pre>
      <span className="snippet-data">
        {snippet.language} | Tags: {snippet.tags.join(", ")}
      </span>
      <SnippetActions snippet={snippet} onDelete={() => onDelete(snippet)} />
    </div>
  )
}
