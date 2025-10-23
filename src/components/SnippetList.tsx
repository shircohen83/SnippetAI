import type { Snippet } from '../types';

interface Props {
  snippets: Snippet[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export default function SnippetList({ snippets, selectedId, onSelect }: Props) {
  return (
    <div className="snippet-list">
      {snippets.length === 0 && (
        <div className="empty">No snippets yet</div>
      )}
      {snippets.map((s) => (
        <button
          key={s.id}
          className={`snippet-item ${selectedId === s.id ? 'active' : ''}`}
          onClick={() => onSelect(s.id)}
          title={s.title}
        >
          <div className="snippet-title">{s.title || 'Untitled'}</div>
          <div className="snippet-meta">
            <span className="badge">{s.language}</span>
            {s.tags.slice(0, 3).map(t => (
              <span key={t} className="badge tag">{t}</span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}
