import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access"));

  const clearTokens = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  const login = async (email, password) => {
    clearTokens();
    const { data } = await api.post("/auth/login/", { email, password });
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    setIsLoggedIn(true);
  };

  const register = async (email, first_name, password) => {
    clearTokens();
    await api.post("/auth/register/", { email, first_name, password });
    await login(email, password);
  };

  const logout = () => {
    clearTokens();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);