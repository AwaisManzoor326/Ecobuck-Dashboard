import { useEffect, useState } from "react";
import { User } from "../types";
import { authAdapter } from "../lib/api/auth-adapter";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    authAdapter
      .getCurrentSession()
      .then((sessionUser) => {
        setUser(sessionUser);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string, rememberMe = true) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const loggedUser = await authAdapter.login(email, password, rememberMe);
      setUser(loggedUser);
      return loggedUser;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setAuthError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authAdapter.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = (updatedFields: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedFields };
    setUser(newUser);
  };

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLoading,
    authError,
    login,
    logout,
    updateUserProfile,
  };
}
