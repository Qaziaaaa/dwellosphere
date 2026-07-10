const API_BASE = '/api/v1';
const AUTH_KEY = 'dwellosphere_auth';
const REQUEST_TIMEOUT = 30_000;

async function getAuthHeaders(): Promise<Record<string, string>> {
  let token: string | null = null;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      token = parsed.token || null;
    }
  } catch { /* ignore */ }
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function withTimeout(ms: number): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function get<T = unknown>(path: string, signal?: AbortSignal): Promise<T> {
  const headers = await getAuthHeaders();
  const timeout = withTimeout(REQUEST_TIMEOUT);
  const res = await fetch(`${API_BASE}${path}`, { headers, signal: signal ?? timeout.signal });
  return handleResponse(res);
}

export async function post<T = unknown>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const headers = await getAuthHeaders();
  const timeout = withTimeout(REQUEST_TIMEOUT);
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: signal ?? timeout.signal,
  });
  return handleResponse(res);
}

export async function put<T = unknown>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const headers = await getAuthHeaders();
  const timeout = withTimeout(REQUEST_TIMEOUT);
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: signal ?? timeout.signal,
  });
  return handleResponse(res);
}

export async function del<T = unknown>(path: string, signal?: AbortSignal): Promise<T> {
  const headers = await getAuthHeaders();
  const timeout = withTimeout(REQUEST_TIMEOUT);
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers, signal: signal ?? timeout.signal });
  return handleResponse(res);
}
