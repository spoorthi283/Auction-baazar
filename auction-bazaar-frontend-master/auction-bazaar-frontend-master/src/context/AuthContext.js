import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoggedIn(true);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    if (userData.userId==="admin")
      return;
    setLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user in localStorage
  };

  const logout = () => {
    setUser(null);
    setLoggedIn(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
