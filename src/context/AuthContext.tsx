"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "@/types/api";
import { fetchAuthUser } from "@/lib/api/auth";
import { saveToken, clearToken } from "@/lib/apiClient";

type AuthContextType = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const storedToken = localStorage.getItem("token");
      const storedUserRaw = localStorage.getItem("auth_user");

      if (!storedToken || !storedUserRaw) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      let storedUser: User | null = null;
      try {
        storedUser = JSON.parse(storedUserRaw) as User;
      } catch {
        clearToken();
        localStorage.removeItem("auth_user");
        if (!cancelled) setIsLoading(false);
        return;
      }

      setToken(storedToken);
      setUser(storedUser);

      try {
        const freshUser = await fetchAuthUser(storedUser.user_id);
        if (!cancelled) {
          setUser(freshUser);
          localStorage.setItem("auth_user", JSON.stringify(freshUser));
        }
      } catch {
        if (!cancelled) {
          clearToken();
          localStorage.removeItem("auth_user");
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function login(newToken: string, newUser: User) {
    saveToken(newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsLoading(false);
  }

  function logout() {
    clearToken();
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth skal bruges inden i AuthProvider");
  return ctx;
}
