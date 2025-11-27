import { useState, useRef, useEffect } from "react";
import type { DraggableSnippet } from "../types";
import './SnippetEditor.css';

interface SnippetEditorProps {
  onSave: (snippet: DraggableSnippet) => void;
}

const languages = ["C", "C++", "Python", "Java", "JS", "JSX", "HTML", "CSS", "TypeScript", "Ruby"];

const SnippetEditor: React.FC<SnippetEditorProps> = ({ onSave }) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    if (!code.trim()) return;

    const snippet: DraggableSnippet = {
      id: Date.now().toString(),
      code,
      language,
      description,
      createdAt: new Date().toISOString(),
      x: 20,
      y: 20,
    };

    onSave(snippet);

    setCode("");
    setLanguage("");
    setDescription("");
  };

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    setMenuOpen(false);
  };

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="snippet-editor-container">
      <textarea
        className="snippet-editor-textarea"
        rows={6}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code snippet..."
      />

      <div className="snippet-editor-row">
        <div className="snippet-editor-dropdown" ref={dropdownRef}>
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
          className="snippet-editor-input description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
      </div>

      <button className="snippet-editor-button" onClick={handleSave}>
        Save Snippet
      </button>
    </div>
  );
};

export { SnippetEditor };
