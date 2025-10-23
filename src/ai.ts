import type { AppSettings } from './types';

export type AIAction = 'explain' | 'refactor' | 'convert';

export interface AIRequest {
  action: AIAction;
  code: string;
  language?: string; // for convert target language
  instructions?: string; // optional user guidance
}

export async function runAi(
  settings: AppSettings,
  req: AIRequest,
  signal?: AbortSignal,
): Promise<string> {
  if (!settings.openAIApiKey) {
    throw new Error('Missing OpenAI API key in Settings');
  }

  const system = buildSystemPrompt(req);
  const user = buildUserPrompt(req);

  // OpenAI responses can be done with responses endpoint or chat; use responses for simplicity
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.openAIApiKey}`,
    },
    body: JSON.stringify({
      model: settings.model || 'gpt-4o-mini',
      reasoning: { effort: 'medium' },
      input: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
    signal,
  });

  if (!response.ok) {
    const text = await safeText(response);
    throw new Error(`OpenAI request failed: ${response.status} ${text}`);
  }

  const json = await response.json();
  // Try to pull out text from the new "output_text" convenience field if present
  const out = json?.output_text
    ?? json?.choices?.[0]?.message?.content
    ?? json?.data?.[0]?.content
    ?? '';
  if (!out) {
    throw new Error('OpenAI response parsing error');
  }
  return String(out).trim();
}

function buildSystemPrompt(req: AIRequest): string {
  switch (req.action) {
    case 'explain':
      return 'You are an expert code explainer. Explain code clearly with bullet points and short snippets.';
    case 'refactor':
      return 'You are a seasoned software engineer. Refactor code for readability, structure, and best practices.';
    case 'convert':
      return 'You are a polyglot developer. Convert code between languages faithfully and idiomatically.';
    default:
      return 'You are a helpful coding assistant.';
  }
}

function buildUserPrompt(req: AIRequest): string {
  const base = `CODE:\n\n${req.code}`;
  const extra = req.instructions ? `\n\nNotes: ${req.instructions}` : '';
  if (req.action === 'convert') {
    const lang = req.language || 'target language';
    return `Convert the following code to ${lang}.\n${base}${extra}`;
  }
  if (req.action === 'refactor') {
    return `Refactor the following code. Return only code unless an explanation is essential.\n${base}${extra}`;
  }
  return `Explain the following code for a developer audience.\n${base}${extra}`;
}

async function safeText(res: Response): Promise<string> {
  try { return await res.text(); } catch { return ''; }
}
