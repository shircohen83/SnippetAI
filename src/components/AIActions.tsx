import { useEffect, useRef, useState } from 'react';
import { runAi, type AIAction } from '../ai';
import type { AppSettings, Snippet } from '../types';

interface Props {
  snippet: Snippet | undefined;
  settings: AppSettings;
}

export default function AIActions({ snippet, settings }: Props) {
  const [action, setAction] = useState<AIAction>('explain');
  const [targetLang, setTargetLang] = useState('python');
  const [instructions, setInstructions] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setOutput('');
    setError(undefined);
    // When changing snippets, clear pending requests
    abortRef.current?.abort();
    abortRef.current = null;
  }, [snippet?.id]);

  async function run() {
    if (!snippet) return;
    setLoading(true);
    setError(undefined);
    setOutput('');
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const text = await runAi(
        settings,
        {
          action,
          code: snippet.code,
          language: action === 'convert' ? targetLang : undefined,
          instructions: instructions || undefined,
        },
        ac.signal,
      );
      setOutput(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="ai-panel">
      <div className="row">
        <select value={action} onChange={(e) => setAction(e.target.value as AIAction)}>
          <option value="explain">Explain</option>
          <option value="refactor">Refactor</option>
          <option value="convert">Convert</option>
        </select>
        {action === 'convert' && (
          <input
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            placeholder="Target language (e.g. python)"
          />
        )}
        <input
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Optional instructions"
        />
        <button disabled={!snippet || loading} onClick={run}>
          {loading ? 'Running…' : 'Run AI'}
        </button>
      </div>
      {!settings.openAIApiKey && (
        <div className="warning">Add your OpenAI API key in Settings to enable AI actions.</div>
      )}
      {error && <div className="error">{error}</div>}
      <textarea
        className="ai-output"
        value={output}
        onChange={(e) => setOutput(e.target.value)}
        placeholder="AI output will appear here"
      />
    </div>
  );
}
