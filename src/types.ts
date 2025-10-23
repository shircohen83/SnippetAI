export type Language =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'go'
  | 'java'
  | 'csharp'
  | 'cpp'
  | 'ruby'
  | 'php'
  | 'rust'
  | 'kotlin'
  | 'swift'
  | 'sql'
  | 'bash'
  | 'markdown';

export interface Snippet {
  id: string; // uuid
  title: string;
  code: string;
  language: Language;
  tags: string[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
  notes?: string;
}

export interface AppSettings {
  openAIApiKey?: string; // stored locally only
  model: string; // e.g. 'gpt-4o-mini'
}

export interface SnippetDB {
  snippets: Snippet[];
  settings: AppSettings;
}
