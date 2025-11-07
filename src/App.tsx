import React, { useState } from "react"
import { SnippetEditor } from "./components/snippetEditor"
import { SnippetActions } from "./components/snippetActions"
import { getSnippets, saveSnippets } from "./utils/storage"
import type { Snippet } from "./types"
import "./App.css"
import { ToggleButton } from "./components/ToggleButton";

const App: React.FC = () => {
  const [snippets, setSnippets] = useState(getSnippets())
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const handleAddSnippet = (snippet: Snippet) => {
    const updated = [snippet, ...snippets]
    setSnippets(updated)
    saveSnippets(updated)
  }

  const handleRemoveSnippet = (snippet: Snippet) => {
    const updated = snippets.filter((s) => s.id !== snippet.id)
    setSnippets(updated)
    saveSnippets(updated)
  }

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"))
  }

  return (
    <div className={`app-container ${theme}`}>
      <div className="title-container">
        <h1 >SnippetAI</h1>
        <ToggleButton isOn={theme === "dark"} onToggle={toggleTheme} />
      </div>
      <SnippetEditor onSave={handleAddSnippet} />
      {snippets.map((snippet) => (
        <div key={snippet.id} className="snippet-card">
          <pre className="snippet-code">{snippet.code}</pre>
          <span className="snippet-data">
            {snippet.language} | Tags: {snippet.tags.join(", ")}
          </span>
          <SnippetActions snippet={snippet} onDelete={handleRemoveSnippet}/>
        </div>
      ))}
    </div>
  )
}

export default App
