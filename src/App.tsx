import React, { useState } from "react"
import { SnippetEditor } from "./components/snippetEditor"
import { getSnippets, saveSnippets } from "./utils/storage"
import type { DraggableSnippet } from "./types"
import { ToggleButton } from "./components/ToggleButton";
import { DraggableSnippetCard } from "./components/DraggableSnippetCard"
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./App.css"
import './utils/Theme.css';

const App: React.FC = () => {
  const [snippets, setSnippets] = useState(getSnippets())
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [editOpen, setEditOpen]= useState(false);

  const handleAddSnippet = (snippet: DraggableSnippet) => {
    const updated = [
      { ...snippet, x: snippet.x ?? 20, y: snippet.y ?? 20 },
      ...snippets
    ]
    setSnippets(updated)
    saveSnippets(updated)
    setEditOpen(false);
  }
  
  const handleRemoveSnippet = (snippet: DraggableSnippet) => {
    const updated = snippets.filter((s) => s.id !== snippet.id)
    setSnippets(updated)
    saveSnippets(updated)
  }

  const handleClearAll = () => {
    confirmAlert({
      title: "Confirm deletion",
      message: "Are you sure you want to delete ALL snippets?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setSnippets([]);
            saveSnippets([]);
          }
        },
        {
          label: "No",
          onClick: () => {}
        }
      ]
    });
  };


  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"))
  }

  const handleDragMove = (id: string, newX: number, newY: number) => {
    setSnippets(prev => {
      const updated = prev.map(snippet => 
        snippet.id === id ? { ...snippet, x: newX, y: newY } : snippet
      )
      saveSnippets(updated)
      return updated
    })
  }

  return (
    <div className={`app-container ${theme}`}>
      <div className="title-container">
        <h1 className="header-title">SnippetAI</h1>
        <div className="mode-label">
          {snippets.length!=0 && <button className="clear-all-btn" onClick={handleClearAll}>
            Clear All
          </button>}
          <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
          <ToggleButton isOn={theme === "dark"} onToggle={toggleTheme} />
        </div>
      </div>
      <div className="content-container">
        <button className="editor-button" onClick={() => setEditOpen(prev => !prev)}> Want to add a snippet?</button>
        {editOpen && <SnippetEditor onSave={handleAddSnippet} onClose={()=>setEditOpen(false)}/>}
        <div className="snippets-container"> 
          {snippets.map((snippet) => (
            <DraggableSnippetCard
              key={snippet.id}
              snippet={snippet}
              onDelete={handleRemoveSnippet}
              onMove={handleDragMove} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
