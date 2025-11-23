import React, { useState, useCallback, useEffect, useRef } from "react"
import { SnippetActions } from "./snippetActions"
import type { DraggableSnippet } from "../types"

type DraggableSnippetCardProps = {
  snippet: DraggableSnippet
  onDelete: (snippet: DraggableSnippet) => void
  onMove: (id: string, newX: number, newY: number) => void
}

export const DraggableSnippetCard: React.FC<DraggableSnippetCardProps> = ({
  snippet,
  onDelete,
  onMove,
}) => {
  
  const [pos, setPos] = useState({ x: snippet.x, y: snippet.y })
  const [isDragging, setIsDragging] = useState(false)
  const [rel, setRel] = useState({ x: 0, y: 0 }) 
  
  // Ref to get the DOM element for position calculation
  const cardRef = useRef<HTMLDivElement>(null)

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()

    setIsDragging(true)
    setRel({
      x: e.pageX - rect.left,
      y: e.pageY - rect.top,
    })

    e.stopPropagation()
    e.preventDefault()
  }, [])

  const onMouseUp = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    
    onMove(snippet.id, pos.x, pos.y)
    
    e.stopPropagation()
    e.preventDefault()
  }, [isDragging, pos.x, pos.y, onMove, snippet.id])

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    
    setPos({
      x: e.pageX - rel.x,
      y: e.pageY - rel.y,
    })

    e.stopPropagation()
    e.preventDefault()
  }, [isDragging, rel.x, rel.y])


  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    } 
    
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging, onMouseMove, onMouseUp]) 
  

  return (
    <div
      ref={cardRef} 
      className="snippet-card"
      style={{ 
        left: `${pos.x}px`, 
        top: `${pos.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
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
