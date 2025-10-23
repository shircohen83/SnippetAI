import { useEffect, useMemo, useState } from 'react';
import './App.css';
import type { Snippet, SnippetDB } from './types';
import { loadDb, saveDb, upsertSnippet, deleteSnippet, setSettings } from './storage';
import SettingsModal from './components/SettingsModal';
import SnippetList from './components/SnippetList';
import SnippetEditor from './components/SnippetEditor';
import AIActions from './components/AIActions';

function App() {
  const [db, setDb] = useState<SnippetDB>(() => loadDb());
  const [selectedId, setSelectedId] = useState<string | undefined>(db.snippets[0]?.id);
  const [showSettings, setShowSettings] = useState(false);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState<string>('');

  useEffect(() => {
    saveDb(db);
  }, [db]);

  function createSnippet() {
    const now = new Date().toISOString();
    const newSnip: Snippet = {
      id: crypto.randomUUID(),
      title: 'New Snippet',
      code: '',
      language: 'typescript',
      tags: [],
      createdAt: now,
      updatedAt: now,
    };
    const updated = upsertSnippet(db, newSnip);
    setDb(updated);
    setSelectedId(newSnip.id);
  }

  function onChangeSnippet(updated: Snippet) {
    setDb(prev => upsertSnippet(prev, updated));
  }

  function onDeleteSnippet(id: string) {
    setDb(prev => deleteSnippet(prev, id));
    if (selectedId === id) {
      setSelectedId(undefined);
    }
  }

  const selected = useMemo(() => db.snippets.find(s => s.id === selectedId), [db.snippets, selectedId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const tag = tagFilter.trim().toLowerCase();
    return db.snippets.filter(s => {
      const matchesText = !q ||
        s.title.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q));
      const matchesTag = !tag || s.tags.some(t => t.toLowerCase() === tag);
      return matchesText && matchesTag;
    });
  }, [db.snippets, search, tagFilter]);

  return (
    <div className="app">
      <header className="topbar">
        <h1>SnippetAI</h1>
        <div className="spacer" />
        <input
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search snippets..."
        />
        <input
          className="search"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          placeholder="Filter by tag"
        />
        <button onClick={createSnippet}>New</button>
        <button onClick={() => setShowSettings(true)}>Settings</button>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <SnippetList
            snippets={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>
        <section className="content">
          {selected ? (
            <SnippetEditor
              snippet={selected}
              onChange={onChangeSnippet}
              onDelete={onDeleteSnippet}
            />
          ) : (
            <div className="empty">Select or create a snippet</div>
          )}
        </section>
        <section className="right">
          <AIActions snippet={selected} settings={db.settings} />
        </section>
      </main>

      <footer className="bottombar">
        <button onClick={() => exportJson(db)}>Export</button>
        <label className="import">
          Import
          <input type="file" accept="application/json" onChange={(e) => importJson(e, setDb)} />
        </label>
      </footer>

      <SettingsModal
        open={showSettings}
        initial={db.settings}
        onClose={() => setShowSettings(false)}
        onSave={(partial) => setDb(prev => setSettings(prev, partial))}
      />
    </div>
  );
}

function exportJson(db: SnippetDB) {
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'snippets.json';
  a.click();
  URL.revokeObjectURL(url);
}

async function importJson(
  e: React.ChangeEvent<HTMLInputElement>,
  setDb: (db: SnippetDB) => void,
) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text) as SnippetDB;
    if (!parsed || !Array.isArray(parsed.snippets) || !parsed.settings) throw new Error('Invalid file');
    setDb(parsed);
  } catch (err) {
    alert('Failed to import JSON: ' + (err instanceof Error ? err.message : String(err)));
  } finally {
    e.target.value = '';
  }
}

export default App;
