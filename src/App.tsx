import React, { useState } from "react"
import { SnippetEditor } from "./components/snippetEditor"
import { getSnippets, saveSnippets } from "./utils/storage"
import type { DraggableSnippet } from "./types"
import "./App.css"
import { ToggleButton } from "./components/ToggleButton";
import { DraggableSnippetCard } from "./components/DraggableSnippetCard"

const App: React.FC = () => {
  const [snippets, setSnippets] = useState(getSnippets())
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const handleAddSnippet = (snippet: DraggableSnippet) => {
    const updated = [snippet, ...snippets]
    setSnippets(updated)
    saveSnippets(updated)
  }

  const handleRemoveSnippet = (snippet: DraggableSnippet) => {
    const updated = snippets.filter((s) => s.id !== snippet.id)
    setSnippets(updated)
    saveSnippets(updated)
  }

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"))
  }

  const handleDrag = (id: string, dx: number, dy: number) => {
    setSnippets(prev =>
      prev.map(snippet => snippet.id === id ? { ...snippet, x: snippet.x + dx, y: snippet.y + dy } : snippet)
    )
  }
  return (
    <div className={`app-container ${theme}`}>
      <div className="title-container">
        <h1 >SnippetAI</h1>
        <ToggleButton isOn={theme === "dark"} onToggle={toggleTheme} />
      </div>
      <div className="content-container">
        <div className="editor-container">
          <SnippetEditor onSave={handleAddSnippet} />
        </div>
        <div className="snippets-container">    
          {snippets.map((snippet) => (
            <div key={snippet.id} className="snippet-card">
              <DraggableSnippetCard
                key={snippet.id}
                snippet={snippet}
                onDrag={handleDrag}
                onDelete={handleRemoveSnippet}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
