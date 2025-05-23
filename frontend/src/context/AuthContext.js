// Replace your entire src/context/AuthContext.js with:

import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async (email, password) => {
    // Your registration logic here, e.g., call your backend API
    // This is a dummy example:
    try {
      // simulate backend call
      const newUser = { email };
      setUser(newUser);
      return newUser;
    } catch (error) {
      throw new Error("Registration failed");
    }
  };

  const login = async (email, password) => {
    // Your login logic here
    const loggedInUser = { email };
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
