import type { Snippet } from "../types"

/*presentational component that receives a list of snippets and renders them on the page. */
export function SnippetList({
  snippets,
  onDelete,
}: {
  snippets: Snippet[]
  onDelete: (id: string) => void
}) {
  return (
    <div>
      {snippets.map((s) => (
        <div key={s.id} style={{ border: "1px solid #ccc", margin: "8px 0", padding: "8px" }}>
          <pre>{s.code}</pre>
          <small>
            {s.language} | Tags: {s.tags.join(", ")}
          </small>
          <br />
          <button onClick={() => onDelete(s.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
