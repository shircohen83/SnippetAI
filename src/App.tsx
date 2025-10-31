import React from "react"
import { SnippetEditor } from "./components/snippetEditor"
import { SnippetActions } from "./components/snippetActions"
import { getSnippets } from "./utils/storage"
import "./App.css"

const App: React.FC = () => {
  const snippets = getSnippets()

  return (
    <div className="app-container">
      <h1 className="title-container">SnippetAI</h1>
      <SnippetEditor />
      {snippets.map((s) => (
        <div key={s.id} className="snippet-card">
        {/*pre tag helps to display the text exactly as you typed it in your code. */}
          <pre className="snippet-code">{s.code}</pre>
          <span className="snippet-data">
            {s.language} | Tags: {s.tags.join(", ")}
          </span>
          <SnippetActions snippet={s} />
        </div>
      ))}
    </div>
  )
}

export default App
