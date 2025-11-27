// mock for real OpenAI calls which later will be replaced with the real OpenAI API calls

/*A promise means you don’t get the string immediately.
The promise will resolve later with the explanation string. */
export async function explainSnippet(code: string) {
  /*This function returns a promise because maybe it will call an API to explain the code. */
  return `Explanation for:\n${code}`
}

export async function refactorSnippet(code: string) {
  return `Refactored version of:\n${code}`
}

export async function bugsSnippet(code: string, targetLang: string) {
  return `found bugs ${targetLang}:\n${code}`
}
