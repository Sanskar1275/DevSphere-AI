import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // RESTORE AUTHENTICATION
  // ==========================================

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");

      const storedUser = localStorage.getItem("user");

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
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      }
    } catch (error) {
      console.error("Failed to restore authentication:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

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

  // ==========================================
  // UPDATE USER
  // ==========================================

  const updateUser = (updatedUser) => {
    if (!updatedUser) {
      return;
    }

    const token = localStorage.getItem("token");

    const newUser = {
      ...updatedUser,
      token,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setUser(newUser);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        updateUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
