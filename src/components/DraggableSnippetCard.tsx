import React, { useCallback, useEffect, useRef, useState } from "react";
import { SnippetActions } from "./snippetActions";
import type { DraggableSnippet } from "../types";

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
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: snippet.x ?? 20, y: snippet.y ?? 20 });
  const posRef = useRef(pos);
  posRef.current = pos;

  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const getContainerEl = () => {
    return cardRef.current?.parentElement as HTMLDivElement | undefined;
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !cardRef.current) return;
    const cardRect = cardRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - cardRect.left,
      y: e.clientY - cardRect.top,
    };
    draggingRef.current = true;
    e.stopPropagation();
    e.preventDefault();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const container = getContainerEl();
      if (!container || !cardRef.current) return;

      const containerRect = container.getBoundingClientRect();
      const cardRect = cardRef.current.getBoundingClientRect();

      let newX = e.clientX - containerRect.left - offsetRef.current.x;
      let newY = e.clientY - containerRect.top - offsetRef.current.y;

      newX = Math.max(0, Math.min(newX, containerRect.width - cardRect.width));
      newY = Math.max(0, Math.min(newY, containerRect.height - cardRect.height));

      setPos({ x: newX, y: newY });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;

      const { x, y } = posRef.current;
      onMove(snippet.id, x, y);

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
        position: "absolute",
      }}
    >
      <pre className="snippet-code">{snippet.code}</pre>
      <span className="snippet-data">
        {snippet.language} | Tags: {snippet.tags.join(", ")}
      </span>
      <SnippetActions snippet={snippet} onDelete={() => onDelete(snippet)} />
    </div>
  );
};
