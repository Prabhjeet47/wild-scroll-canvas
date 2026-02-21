import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "user";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (role?: UserRole) => void;
  logout: () => void;
  toggleRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<UserRole, User> = {
  admin: {
    id: "1",
    name: "Alex Ranger",
    email: "alex@wildguard.org",
    role: "admin",
  },
  user: {
    id: "2",
    name: "Sam Observer",
    email: "sam@wildguard.org",
    role: "user",
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole = "admin") => {
    setUser(MOCK_USERS[role]);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleRole = () => {
    if (user) {
      const newRole: UserRole = user.role === "admin" ? "user" : "admin";
      setUser(MOCK_USERS[newRole]);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, toggleRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
