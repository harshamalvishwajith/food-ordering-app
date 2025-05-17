"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser, UserType } from "@/utils/authHelpers";
import { set } from "date-fns";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string, userType: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, userType: UserType) => {
    const data = await loginUser(email, password, userType);
    if (!data) {
      throw new Error("Login failed. Please check your credentials.");
    }
    setUser(data);
    console.log("Login successful", data);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(data));
  };
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
