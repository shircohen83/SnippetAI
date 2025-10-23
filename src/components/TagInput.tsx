import { useState } from 'react';

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: Props) {
  const [value, setValue] = useState('');

  function addTag(newTag: string) {
    const t = newTag.trim();
    if (!t) return;
    if (tags.includes(t)) return;
    onChange([...tags, t]);
    setValue('');
  }

  return (
    <div className="tag-input">
      <div className="tags">
        {tags.map((t) => (
          <span key={t} className="tag">
            {t}
            <button className="tag-remove" onClick={() => onChange(tags.filter(x => x !== t))}>
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(value);
          }
          if (e.key === 'Backspace' && !value && tags.length) {
            onChange(tags.slice(0, -1));
          }
        }}
        placeholder="Add tag and press Enter"
      />
      <button onClick={() => addTag(value)}>Add</button>
    </div>
  );
}
