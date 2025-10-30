import { SnippetEditor } from "./components/snippetEditor"
import { SnippetActions } from "./components/snippetActions"
import { getSnippets } from "./utils/storage"

export default function App() {
  const snippets = getSnippets()

  return (
    <div style={{ padding: 20 }}>
      <h1>SnippetAI</h1>
      <SnippetEditor />

      {snippets.map((s) => (
        <div
          key={s.id}
          style={{
            border: "1px solid #ccc",
            margin: "12px 0",
            padding: "12px",
            borderRadius: "6px",
          }}
        >
          <pre>{s.code}</pre>
          <small>
            {s.language} | Tags: {s.tags.join(", ")}
          </small>
          <SnippetActions snippet={s} />
        </div>
      ))}
    </div>
  )
}
