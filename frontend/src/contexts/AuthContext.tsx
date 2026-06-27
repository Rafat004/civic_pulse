"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchApi } from "../lib/api";

type User = {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar_url: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await fetchApi("/auth/me");
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const logout = () => {
    // We redirect to the backend logout endpoint which will clear the cookie and redirect back
    let API_URL = process.env.NEXT_PUBLIC_API_URL || "https://stunning-acceptance-production-9c5c.up.railway.app/api/v1";
    if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
    if (!API_URL.endsWith('/api/v1')) API_URL += '/api/v1';
    window.location.href = `${API_URL}/auth/logout`;
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
