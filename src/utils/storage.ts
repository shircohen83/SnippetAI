/* saves and loads snippets so that when you refresh the browser, your code snippets don’t disappear. */
import type { DraggableSnippet } from "../types"

const STORAGE_KEY = "snippets"
/*localStorage is a built-in browser API — it’s available automatically in any web page or React app.
The project will use the storage that connected to 'snippets' key */

export const getSnippets = (): DraggableSnippet[] => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const saveSnippets = (snippets: DraggableSnippet[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
}
