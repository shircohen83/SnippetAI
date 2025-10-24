import type { Snippet } from "../types"
import { explainSnippet, refactorSnippet, convertSnippet } from "../api/openai"
import { getSnippets, saveSnippets } from "../utils/storage"

export function SnippetActions({ snippet }: { snippet: Snippet }) {
  /* 
  explainSnippet returns a promise.
  await pauses the function until the promise resolves.
  The resolved string is passed into alert() */
  async function handleExplain() {
    alert(await explainSnippet(snippet.code))
  }

  async function handleRefactor() {
    alert(await refactorSnippet(snippet.code))
  }

  async function handleConvert() {
    alert(await convertSnippet(snippet.code, "Python"))
  }

  function handleDelete() {
    const snippets = getSnippets()
    const updated = snippets.filter((s) => s.id !== snippet.id)
    saveSnippets(updated)
    window.location.reload() // so UI updates if no parent state
  }

  return (
    <div style={{ margin: "8px 0" }}>
      <button onClick={handleExplain}>Explain</button>
      <button onClick={handleRefactor}>Refactor</button>
      <button onClick={handleConvert}>Convert to Python</button>
      <button onClick={handleDelete}>Delete snippet</button>
    </div>
  )
}
