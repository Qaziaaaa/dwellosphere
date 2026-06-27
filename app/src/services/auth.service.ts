import type { AuthResponse, LoginInput, RegisterInput, User } from '@/types/user.types';
import * as api from '@/lib/api';

const STORAGE_KEY = 'dwellosphere_auth';

export async function login(input: LoginInput): Promise<AuthResponse> {
  const data = await api.post('/auth/login', input);
  const auth = { user: data.user as User, token: data.token as string };
  persistAuth(auth);
  return auth;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const data = await api.post('/auth/register', input);
  const auth = { user: data.user as User, token: data.token as string };
  persistAuth(auth);
  return auth;
}

export async function getProfile(): Promise<User> {
  const data = await api.get('/auth/profile');
  return data as User;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getStoredAuth(): { user: User; token: string } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function persistAuth(auth: { user: User; token: string }): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}
