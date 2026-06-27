import { createContext, useState, useCallback, type ReactNode } from 'react';
import type { User, LoginInput, RegisterInput } from '@/types/user.types';
import * as authService from '@/services/auth.service';

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function getInitialAuth() {
  const stored = authService.getStoredAuth();
  return stored ?? { user: null, token: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [{ user, token }, setAuth] = useState<{ user: User | null; token: string | null }>(getInitialAuth);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (input: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await authService.login(input);
      setAuth({ user: response.user, token: response.token });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await authService.register(input);
      setAuth({ user: response.user, token: response.token });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAuth({ user: null, token: null });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
