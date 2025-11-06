import React, { useState } from "react"
import { SnippetEditor } from "./components/snippetEditor"
import { SnippetActions } from "./components/snippetActions"
import { getSnippets, saveSnippets } from "./utils/storage"
import type { Snippet } from "./types"
import "./App.css"

const App: React.FC = () => {
  const [snippets, setSnippets] = useState(getSnippets())

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
  return (
    <div className="app-container">
      <h1 className="title-container">SnippetAI</h1>
      <SnippetEditor onSave={handleAddSnippet} />
      {snippets.map((snippet) => (
        <div key={snippet.id} className="snippet-card">
          <pre className="snippet-code">{snippet.code}</pre>
          <span className="snippet-data">
            {snippet.language} | Tags: {snippet.tags.join(", ")}
          </span>
          <SnippetActions snippet={snippet} onDelete={ handleRemoveSnippet }/>
        </div>
      ))}
    </div>
  )
}

export default App
