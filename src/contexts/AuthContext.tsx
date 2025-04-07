import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AuthContext, AuthContextType, LoginData } from "./createContexts/auth";
import { isTokenExpired } from "../utils/app/time";

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const removeUser = () => {
    Cookies.remove("user");
    Cookies.remove("token");
  };

  useEffect(() => {
    const user = JSON.parse(Cookies.get("user") || "null");
    const token = JSON.parse(Cookies.get("token") || "null");
    if (user && !isTokenExpired(token.access)) {
      setUser(JSON.parse(user));
    } else {
      removeUser();
    }
  }, []);

  const login = ({ user, ...tokens }: LoginData) => {
    Cookies.set("user", JSON.stringify(user));
    Cookies.set("token", JSON.stringify(tokens));
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
