"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, { password: string; profile: UserProfile }> = {
  "admin@sturgeon.com": {
    password: "admin123",
    profile: { id: "u1", name: "系統管理員", role: "Admin", email: "admin@sturgeon.com" },
  },
  "user@sturgeon.com": {
    password: "user123",
    profile: { id: "u2", name: "倉儲人員", role: "倉管", email: "user@sturgeon.com" },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("erp_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setIsInitialized(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // 模擬API延遲
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const entry = MOCK_USERS[email];
    if (entry && entry.password === password) {
      setUser(entry.profile);
      sessionStorage.setItem("erp_user", JSON.stringify(entry.profile));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("erp_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isInitialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
