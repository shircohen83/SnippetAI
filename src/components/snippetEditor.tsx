import { useState } from "react"
import type { Snippet } from "../types"

interface SnippetEditorProps {
  onSave: (snippet: Snippet) => void
}

/**
 * SnippetEditor Component
 * Allows the user to write a code snippet, select its language, and add tags — then save it.
 */
const SnippetEditor: React.FC<SnippetEditorProps> = ({ onSave }) => {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("")
  const [tags, setTags] = useState("")

  const handleSave = () => {
    if (!code.trim()) return

    const snippet: Snippet = {
      id: Date.now().toString(),
      code,
      language,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    }

    onSave(snippet) // notify parent

    setCode("")
    setLanguage("")
    setTags("")
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <textarea
        rows={6}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code snippet..."
      />
      <input
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        placeholder="Language"
      />
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
      />
      <button onClick={handleSave}>Save Snippet</button>
    </div>
  )
}
export { SnippetEditor }
