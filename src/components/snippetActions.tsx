import React, { useState } from "react"
import type { Snippet } from "../types"
import { explainSnippet, refactorSnippet, convertSnippet } from "../api/openai"

type SnippetActionsProps = {
  snippet: Snippet
  onDelete: (snippet: Snippet) => void
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
  
  const handleAiResponseContainer=(result: string)=>{
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
    const confirmed = window.confirm("Are you sure you want to delete this snippet?")
    if (!confirmed) return
    onDelete(snippet)
  }

  return (
    <div style={{ margin: "8px 0" }}>
      <button onClick={handleExplain}>Explain</button>
      <button onClick={handleRefactor}>Refactor</button>
      <button onClick={handleConvert}>Convert to Python</button>
      <button onClick={handleDelete}>Delete snippet</button>

      {displayOutput && (
        <>
          <style>{`
            .ai-response-container {
              background-color: rgba(144, 238, 144, 0.25);
              padding: 18px;
              border-radius: 4px;
              width: 800px;
            }
          `}</style>
          <pre className="ai-response-container">{output}</pre>
        </>
      )}
    </div>
  )
}
