import React, { useState } from "react"
import type { DraggableSnippet } from "../types"
import { explainSnippet, refactorSnippet, bugsSnippet } from "../api/openai"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import "./SnippetActions.css";


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

  const handleFindingBugs = async () => {
    const result = await bugsSnippet(snippet.code, "the bugs")
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

  const handleCopy = async () => {
    navigator.clipboard.writeText(snippet.code);
    handleAiResponseContainer("Code copied to clipboard ✅");
  } 

  return (
    <>
      <button className="delete-snippet" onClick={handleDelete}>X</button>

      <div className="buttons-line">
        <button onClick={handleExplain}>Explain</button>
        <button onClick={handleRefactor}>Refactor</button>
        <button onClick={handleFindingBugs}>Find bugs</button>
        <button onClick={handleCopy} className="copy-btn">Copy to clipboard</button>
      </div>

      {displayOutput && ( <pre className="ai-response-container">{output}</pre> )}
    </>
  )
}
