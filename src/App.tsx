import { useState } from "react"
import { getSnippets, saveSnippets } from "./utils/storage"
import { SnippetEditor } from "./components/snippetEditor"
import { SnippetList } from "./components/snippetList"
import { SnippetActions } from "./components/snippetActions"

export default function App() {
  const [snippets, setSnippets] = useState(getSnippets())

  function handleDelete(id: string) {
    const updated = snippets.filter((s) => s.id !== id)
    setSnippets(updated)
    saveSnippets(updated)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>SnippetAI</h1>
      <SnippetEditor />
      <SnippetList snippets={snippets} onDelete={handleDelete} />
      {snippets.map((s) => (
        <SnippetActions key={s.id} snippet={s} />
      ))}
    </div>
  )
}
