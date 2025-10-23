import { useState } from "react"
import type { Snippet } from "../types"
import { getSnippets, saveSnippets } from "../utils/storage"

/*lets the user write a new code snippet, select its language, and add tags — then save it to the main list */
export function SnippetEditor() {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("")
  const [tags, setTags] = useState("")
  const [snippets, setSnippets] = useState<Snippet[]>(getSnippets())

  function handleSave() {
    if (!code.trim()) return

    const snippet: Snippet = {
      id: Date.now().toString(),
      code,
      language,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    }

    const updated = [snippet, ...snippets]
    setSnippets(updated)
    saveSnippets(updated)

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
