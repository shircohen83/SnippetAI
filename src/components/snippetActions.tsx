import React, { useState } from "react"
import type { DraggableSnippet } from "../types"
import { explainSnippet, refactorSnippet, convertSnippet } from "../api/openai"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

type SnippetActionsProps = {
  snippet: DraggableSnippet
  onDelete: (snippet: DraggableSnippet) => void
}

/* 
  explainSnippet returns a promise.
  await pauses the function until the promise resolves.
  The resolved string is passed to the output
*/
export const SnippetActions: React.FC<SnippetActionsProps> = ({
  snippet,
  onDelete,
}) => {
  const [output, setOutput] = useState<string>("")
  const [displayOutput, setDisplayOutput] = useState(false)
  
  const handleAiResponseContainer = (result: string) => {
    if (!displayOutput) {
      setOutput(result)
      setDisplayOutput(true)
    } else if (displayOutput && output !== result) {
      setOutput(result)
    } else {
      setDisplayOutput(false)
    }
  }

  const handleExplain = async () => {
    const result = await explainSnippet(snippet.code)
    handleAiResponseContainer(result)
  }

  const handleRefactor = async () => {
    const result = await refactorSnippet(snippet.code)
    handleAiResponseContainer(result)
  }

  const handleConvert = async () => {
    const result = await convertSnippet(snippet.code, "Python")
    handleAiResponseContainer(result)
  }

  const handleDelete = () => {
    confirmAlert({
      title: 'Confirm deletion',
      message: 'Are you sure you want to delete this snippet?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => onDelete(snippet)
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    })
  }

  return (
    <>
    <style>{`
      .ai-response-container {
        background-color: rgba(144, 238, 144, 0.25);
        padding: 18px;
        border-radius: 4px;
        width: 800px;
        margin-top: 8px;
      }

      .buttons-line {
        display: flex;        /* arrange buttons in a row */
        gap: 8px;             /* space between buttons */
        margin: 8px 0;
      }

      .buttons-line button {
        padding: 6px 12px;    /* nicer button size */
        border-radius: 4px;
        border: 1px solid #ccc;
        background-color: #f0f0f0;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s, transform 0.1s;
      }

      .buttons-line button:hover {
        background-color: #e0e0e0;
        transform: translateY(-1px);
      }

      .delete-x {
        position: absolute;
        top: 8px;
        right: 2px;
        cursor: pointer;
        font-weight: bold;
        background: transparent;
        border: none;
        font-size: 24px;
        color: #900;
      }
    `}</style>


      <button className="delete-x" onClick={handleDelete}>×</button>

      <div className="buttons-line">
        <button onClick={handleExplain}>Explain</button>
        <button onClick={handleRefactor}>Refactor</button>
        <button onClick={handleConvert}>Convert to Python</button>
      </div>

      {displayOutput && ( <pre className="ai-response-container">{output}</pre> )}
    </>
  )
}
