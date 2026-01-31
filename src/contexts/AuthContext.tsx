import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UserRole } from "@/lib/constants";
import { apiLogin, apiMe, apiRegisterUser, apiRegisterVendor, AuthUser } from "@/lib/api";

export type User = AuthUser;

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
};

type RegisterData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  businessName?: string;
  address?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    async function boot() {
      try {
        if (token) {
          // Trust backend as source of truth
          const me = await apiMe();
          setUser(me);
          localStorage.setItem("user", JSON.stringify(me));
        } else if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setIsLoading(false);
      }
    }

    boot();
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    try {
      const { token, user } = await apiLogin(email, password, role);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // Customer vs Vendor registration goes to different endpoints
      if (userData.role === "vendor") {
        const { token, user } = await apiRegisterVendor({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
          businessName: userData.businessName,
          address: userData.address,
          categories: [],
        });

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        return;
      }

      const { token, user } = await apiRegisterUser({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
      });

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
