import React, { createContext, useContext, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { session, isLoading, needsWallet } = useAuth(); // Your useAuth hook

  return (
    <AuthContext.Provider value={{ session, isLoading, needsWallet }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
