"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  error: string | null;
  //updateUserProfile: (userData: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Проверка авторизации при загрузке страницы
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Authentication error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🔑 Функция для входа
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка входа");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("tokens", JSON.stringify(data.tokens));

      setUser(data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 📝 Функция для регистрации
  const signup = async ({ email, password, firstName, lastName }: SignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка регистрации");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("tokens", JSON.stringify(data.tokens));

      setUser(data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🚪 Функция для выхода
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    setUser(null);
    router.push("/login");
  };

  // 🔄 Обновление профиля пользователя
  // const updateUserProfile = async (userData: Partial<User>) => {
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
  //     const res = await fetch("http://127.0.0.1:8000/api/user/profile/", {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${tokens.access}`,
  //       },
  //       body: JSON.stringify(userData),
  //     });

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.error || "Ошибка обновления профиля");

  //     const updatedUser = { ...user, ...userData };
  //     localStorage.setItem("user", JSON.stringify(updatedUser));
  //     setUser(updatedUser);
  //   } catch (err: any) {
  //     setError(err.message);
  //     throw err;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // 🔑 Обновление пароля
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
      const res = await fetch("http://127.0.0.1:8000/api/user/password/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка обновления пароля");
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        error,
        //updateUserProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
