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

  // State to track whether code section is expanded
  const [expanded, setExpanded] = useState(false);

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
      onMove(snippet.id, pos.x, pos.y);

      e.stopPropagation();
      e.preventDefault();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onMove, snippet.id, pos.x, pos.y]);

  // Sync position if snippet props change
  useEffect(() => {
    setPos({ x: snippet.x ?? 20, y: snippet.y ?? 20 });
  }, [snippet.x, snippet.y]);

  // Collapse expanded code when clicking outside the card
  useEffect(() => {
    if (!expanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!cardRef.current) return;

      if (!cardRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expanded]);

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
      <pre
        className={`snippet-code ${expanded ? "expanded" : ""}`}
        onMouseDown={(e) => e.stopPropagation()} // prevent the event from reaching the parent (snippet-card)
        onClick={() => setExpanded((prev) => !prev)}
      >
        {snippet.code}
      </pre>

      <span className="snippet-data">
        {snippet.language}
        {snippet.description && ` | description: ${snippet.description}`}
      </span>
      <SnippetActions snippet={snippet} onDelete={() => onDelete(snippet)} />
    </div>
  );
};
