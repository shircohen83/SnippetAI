import { useEffect, useState } from 'react';
import type { AppSettings } from '../types';

interface Props {
  open: boolean;
  initial: AppSettings;
  onClose: () => void;
  onSave: (settings: Partial<AppSettings>) => void;
}

export default function SettingsModal({ open, initial, onClose, onSave }: Props) {
  const [apiKey, setApiKey] = useState(initial.openAIApiKey || '');
  const [model, setModel] = useState(initial.model);

  useEffect(() => {
    if (open) {
      setApiKey(initial.openAIApiKey || '');
      setModel(initial.model);
    }
  }, [open, initial]);

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Settings</h2>
        <label className="field">
          <span>OpenAI API Key</span>
          <input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </label>
        <label className="field">
          <span>Model</span>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="gpt-4o-mini"
          />
        </label>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => {
              onSave({ openAIApiKey: apiKey || undefined, model });
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
