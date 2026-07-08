import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../api/auth.js";
import { tokenStore } from "../lib/http.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Only "loading" if there's a token whose session we still need to resolve.
  const [loading, setLoading] = useState(() => Boolean(tokenStore.get()));

  // Restore session on first load if a token is present.
  useEffect(() => {
    if (!tokenStore.get()) return;
    let active = true;
    authApi
      .me()
      .then((data) => active && setUser(data.user))
      .catch(() => {
        tokenStore.clear();
        if (active) setUser(null);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const persistSession = ({ user: nextUser, token }) => {
    tokenStore.set(token);
    setUser(nextUser);
  };

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    persistSession(data);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    persistSession(data);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
