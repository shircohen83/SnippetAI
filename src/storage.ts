import type { Snippet, SnippetDB, AppSettings } from './types';

const DB_KEY = 'snippet_ai_db_v1';

const defaultSettings: AppSettings = {
  model: 'gpt-4o-mini',
};

function createEmptyDb(): SnippetDB {
  return { snippets: [], settings: defaultSettings };
}

export function loadDb(): SnippetDB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return createEmptyDb();
    const parsed = JSON.parse(raw) as Partial<SnippetDB>;
    return {
      snippets: Array.isArray(parsed.snippets) ? parsed.snippets as Snippet[] : [],
      settings: { ...defaultSettings, ...(parsed.settings || {}) },
    };
  } catch {
    return createEmptyDb();
  }
}

export function saveDb(db: SnippetDB): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function upsertSnippet(db: SnippetDB, snippet: Snippet): SnippetDB {
  const idx = db.snippets.findIndex(s => s.id === snippet.id);
  const updated = { ...db };
  if (idx >= 0) {
    updated.snippets = [
      ...db.snippets.slice(0, idx),
      snippet,
      ...db.snippets.slice(idx + 1),
    ];
  } else {
    updated.snippets = [snippet, ...db.snippets];
  }
  return updated;
}

export function deleteSnippet(db: SnippetDB, id: string): SnippetDB {
  return { ...db, snippets: db.snippets.filter(s => s.id !== id) };
}

export function setSettings(db: SnippetDB, settings: Partial<AppSettings>): SnippetDB {
  return { ...db, settings: { ...db.settings, ...settings } };
}
