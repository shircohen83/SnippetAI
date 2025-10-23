import { useEffect, useMemo, useState } from 'react';
import type { Language, Snippet } from '../types';
import TagInput from './TagInput';

const LANGUAGES: Language[] = [
  'javascript','typescript','python','go','java','csharp','cpp','ruby','php','rust','kotlin','swift','sql','bash','markdown'
];

interface Props {
  snippet: Snippet;
  onChange: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
}

export default function SnippetEditor({ snippet, onChange, onDelete }: Props) {
  const [title, setTitle] = useState(snippet.title);
  const [language, setLanguage] = useState<Language>(snippet.language);
  const [code, setCode] = useState(snippet.code);
  const [tags, setTags] = useState<string[]>(snippet.tags);
  const [notes, setNotes] = useState(snippet.notes || '');

  useEffect(() => {
    setTitle(snippet.title);
    setLanguage(snippet.language);
    setCode(snippet.code);
    setTags(snippet.tags);
    setNotes(snippet.notes || '');
  }, [snippet.id]);

  useEffect(() => {
    const updated: Snippet = {
      ...snippet,
      title,
      language,
      code,
      tags,
      notes: notes || undefined,
      updatedAt: new Date().toISOString(),
    };
    onChange(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, language, code, tags, notes]);

  const langOptions = useMemo(() => LANGUAGES.map(l => (
    <option key={l} value={l}>{l}</option>
  )), []);

  return (
    <div className="editor">
      <div className="row">
        <input
          className="title-input"
          value={title}
          placeholder="Snippet title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
          {langOptions}
        </select>
        <button className="danger" onClick={() => onDelete(snippet.id)}>Delete</button>
      </div>
      <textarea
        className="code-area"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        spellCheck={false}
      />
      <label className="field">
        <span>Tags</span>
        <TagInput tags={tags} onChange={setTags} />
      </label>
      <label className="field">
        <span>Notes</span>
        <textarea
          className="notes-area"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes about this snippet"
        />
      </label>
    </div>
  );
}
