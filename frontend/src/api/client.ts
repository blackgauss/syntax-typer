const BASE_URL = "http://localhost:8000";

export interface Snippet {
  id: string;
  language: string;
  title: string;
  difficulty: string;
  tags: string[];
  code: string;
}

export async function fetchSnippet(id?: string): Promise<Snippet> {
  const url = id ? `${BASE_URL}/snippets/${id}` : `${BASE_URL}/snippets/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch snippet: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}

export async function fetchLanguages(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/languages/`);
  if (!res.ok) throw new Error(`Failed to fetch languages: ${res.status}`);
  return res.json();
}
