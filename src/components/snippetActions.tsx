import type { Snippet } from "../types"
import { explainSnippet, refactorSnippet, convertSnippet } from "../api/openai"

/*provides AI-powered actions for a single snippet, they don’t add/remove snippets from the list. */
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

  return (
    <div style={{ margin: "8px 0" }}>
      <button onClick={handleExplain}>Explain</button>
      <button onClick={handleRefactor}>Refactor</button>
      <button onClick={handleConvert}>Convert to Python</button>
    </div>
  )
}
