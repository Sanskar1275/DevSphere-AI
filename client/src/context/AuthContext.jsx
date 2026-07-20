import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // Check that both values actually exist
      if (
        token &&
        storedUser &&
        storedUser !== "undefined" &&
        storedUser !== "null"
      ) {
        const parsedUser = JSON.parse(storedUser);

        setUser({
          ...parsedUser,
          token,
        });
      } else {
        // Remove invalid/stale authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      }
    } catch (error) {
      console.error("Failed to restore authentication:", error);

      // Clear corrupted localStorage data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    if (!token || !userData) {
      console.error("Invalid login data");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser({
      ...userData,
      token,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};