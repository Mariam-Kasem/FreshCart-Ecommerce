import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("userToken") || null);

  function saveToken(newToken) {
    localStorage.setItem("userToken", newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("userToken");
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}