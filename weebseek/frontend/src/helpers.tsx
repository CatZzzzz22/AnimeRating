const API_BASE = "http://localhost:5050";

export async function apiFetch<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, init);

  if (!res.ok) {
    let errorMsg: string;
    try {
      const errBody = await res.json();
      errorMsg = errBody.error || null;
    } catch {
      errorMsg = res.statusText;
    }
    throw new Error(`API Error (${res.status}): ${errorMsg}`);
  }

  return (await res.json()) as T;
}
