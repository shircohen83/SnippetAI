// mock for real OpenAI calls which later will be replaced with the real OpenAI API calls
export async function explainSnippet(code: string) {
  return `Explanation for:\n${code}`
}

export async function refactorSnippet(code: string) {
  return `Refactored version of:\n${code}`
}

export async function convertSnippet(code: string, targetLang: string) {
  return `Converted to ${targetLang}:\n${code}`
}
