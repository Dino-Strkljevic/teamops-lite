import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import apiClient from "../../lib/api";
import { tokenStore } from "../../lib/tokenStore";
import type { AuthResponse, AuthUser, LoginBody } from "../../types";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  login: (body: LoginBody) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

async function fetchMe(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>("/auth/me");
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // On mount: if a token exists, hydrate the current user.
  useEffect(() => {
    if (!tokenStore.get()) {
      setIsLoading(false);
      return;
    }
    fetchMe()
      .then(setUser)
      .catch(() => {
        // Token invalid / expired — clear it so the guard redirects to /login.
        tokenStore.clear();
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (body: LoginBody): Promise<void> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", body);
    tokenStore.set(data.token);
    const me = await fetchMe();
    setUser(me);
  }, []);

  const logout = useCallback((): void => {
    tokenStore.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
