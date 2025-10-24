import { SnippetEditor } from "./components/snippetEditor"
import { SnippetList } from "./components/snippetList"
import { SnippetActions } from "./components/snippetActions"
import { getSnippets } from "./utils/storage"

export default function App() {
  const snippets= getSnippets();
  return (
    <div style={{ padding: 20 }}>
      <h1>SnippetAI</h1>
      <SnippetEditor />
      <SnippetList />
      {snippets.map((s) => (
        <SnippetActions key={s.id} snippet={s} />
      ))}
    </div>
  )
}
