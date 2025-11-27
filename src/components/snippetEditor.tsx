import { useState } from "react";
import type { DraggableSnippet } from "../types";
import './SnippetEditor.css';

interface SnippetEditorProps {
  onSave: (snippet: DraggableSnippet) => void;
}

const languages = ["C", "C++", "Python", "Java", "JS", "JSX", "HTML", "CSS", "TypeScript", "Ruby"];

const SnippetEditor: React.FC<SnippetEditorProps> = ({ onSave }) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [tags, setTags] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSave = () => {
    if (!code.trim()) return;

    const snippet: DraggableSnippet = {
      id: Date.now().toString(),
      code,
      language,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      x: 20,
      y: 20,
    };

    onSave(snippet);

    setCode("");
    setLanguage("");
    setTags("");
  };

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    setMenuOpen(false);
  };

  return (
    <div className="snippet-editor-container">
      <textarea
        className="snippet-editor-textarea"
        rows={6}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code snippet..."
      />

      <div className="snippet-editor-dropdown">
        <button
          className="snippet-editor-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {language || "Select Language"}
        </button>

        {menuOpen && (
          <ul className="snippet-editor-menu">
            {languages.map((lang) => (
              <li
                key={lang}
                className="snippet-editor-menu-item"
                onClick={() => handleLanguageSelect(lang)}
              >
                {lang}
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        className="snippet-editor-input"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
      />

      <button className="snippet-editor-button" onClick={handleSave}>
        Save Snippet
      </button>
    </div>
  );
};

export { SnippetEditor };
