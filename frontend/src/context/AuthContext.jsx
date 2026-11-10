import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("user")) || null; }
    catch { return null; }
  });
  const [token, setToken] = useState(() => sessionStorage.getItem("token") || null);

  useEffect(() => {
    if (user) sessionStorage.setItem("user", JSON.stringify(user));
    else sessionStorage.removeItem("user");
    if (token) sessionStorage.setItem("token", token);
    else sessionStorage.removeItem("token");
  }, [user, token]);

  const login = (userData, authToken) => {
    // grava o token antes de atualizar o estado, para chamadas imediatas já usarem ele
    sessionStorage.setItem("token", authToken);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  };

  const logout = useCallback(() => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    setToken(null);
  }, []);

  // Sessão expirada: sai automaticamente (ProtectedRoute leva para /login).
  useEffect(() => {
    window.addEventListener("auth:expired", logout);
    return () => window.removeEventListener("auth:expired", logout);
  }, [logout]);

  // Ao abrir o app, busca os dados atuais do usuário (role, foto, nome).
  useEffect(() => {
    if (!token) return;
    api("/usuarios/me").then(setUser).catch(() => {});
  }, [token]);

  return <AuthContext.Provider value={{ user, token, login, logout, setUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
