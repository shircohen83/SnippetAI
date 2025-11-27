import React, { useCallback, useEffect, useRef, useState } from "react";
import { SnippetActions } from "./SnippetActions";
import type { DraggableSnippet } from "../types";
import "./DraggableSnippetCard.css";

type DraggableSnippetCardProps = {
  snippet: DraggableSnippet;
  onDelete: (snippet: DraggableSnippet) => void;
  onMove: (id: string, newX: number, newY: number) => void;
};

export const DraggableSnippetCard: React.FC<DraggableSnippetCardProps> = ({
  snippet,
  onDelete,
  onMove,
}) => {
  // Reference to the card DOM element
  const cardRef = useRef<HTMLDivElement | null>(null);

  // State to track current position of the card
  const [pos, setPos] = useState({ x: snippet.x ?? 20, y: snippet.y ?? 20 });
  
  // Ref to track if the card is currently being dragged
  const draggingRef = useRef(false);

  // Ref to store the offset between mouse position and top-left corner of the card
  const offsetRef = useRef({ x: 0, y: 0 });

  // Helper to get the parent container element
  const getContainerEl = () => {
    return cardRef.current?.parentElement as HTMLDivElement | undefined;
  };

  
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !cardRef.current) return; // only left click
    const cardRect = cardRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - cardRect.left,
      y: e.clientY - cardRect.top,
    };
    draggingRef.current = true; 
    e.stopPropagation();
    e.preventDefault();
  }, []);

  // Handle dragging movement and release
  useEffect(() => {

    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;

      const container = getContainerEl();
      if (!container || !cardRef.current) return;

      const containerRect = container.getBoundingClientRect();
      const cardRect = cardRef.current.getBoundingClientRect();

      // Calculate new position relative to container
      let newX = e.clientX - containerRect.left - offsetRef.current.x;
      let newY = e.clientY - containerRect.top - offsetRef.current.y;

      // Keep card inside container bounds
      newX = Math.max(0, Math.min(newX, containerRect.width - cardRect.width));
      newY = Math.max(0, Math.min(newY, containerRect.height - cardRect.height));

      setPos({ x: newX, y: newY });
    };

    // Mouse up: stop dragging and notify parent of new position
    const handleMouseUp = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;

      const { x, y } = pos;
      onMove(snippet.id, x, y); // inform parent about updated position

      e.stopPropagation();
      e.preventDefault();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onMove, snippet.id]);

  // Sync position if snippet props change
  useEffect(() => {
    setPos({ x: snippet.x ?? 20, y: snippet.y ?? 20 });
  }, [snippet.x, snippet.y]);

  return (
    <div
      ref={cardRef}
      className="snippet-card"
      onMouseDown={handleMouseDown}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        cursor: draggingRef.current ? "grabbing" : "grab",
      }}
    >
      <pre className="snippet-code">{snippet.code}</pre>
      <span className="snippet-data">
        {snippet.language} | description: {snippet.description}
      </span>
      <SnippetActions snippet={snippet} onDelete={() => onDelete(snippet)} />
    </div>
  );
};
