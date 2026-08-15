import { createContext, useContext, useEffect, useState } from "react";

// ==========================================
// CREATE AUTH CONTEXT
// ==========================================

export const AuthContext = createContext(null);

// ==========================================
// AUTH PROVIDER
// ==========================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // RESTORE AUTHENTICATION
  // ==========================================

  useEffect(() => {
    const restoreAuthentication = () => {
      try {
        const token = localStorage.getItem("token");

        const storedUser = localStorage.getItem("user");

        // --------------------------------------
        // NO AUTHENTICATION
        // --------------------------------------

        if (
          !token ||
          !storedUser ||
          storedUser === "undefined" ||
          storedUser === "null"
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setUser(null);

          return;
        }

        // --------------------------------------
        // RESTORE USER
        // --------------------------------------

        const parsedUser = JSON.parse(storedUser);

        setUser({
          ...parsedUser,
          token,
        });
      } catch (error) {
        console.error("Failed to restore authentication:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreAuthentication();
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = (token, userData) => {
    try {
      if (!token) {
        console.error("Login failed: token is missing.");
        return false;
      }

      if (!userData) {
        console.error("Login failed: user data is missing.");
        return false;
      }

      // Save authentication data
      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify(userData));

      // Update React state
      setUser({
        ...userData,
        token,
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);

      return false;
    }
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
  // AUTH CONTEXT VALUE
  // ==========================================

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
  };

  // ==========================================
  // PROVIDER
  // ==========================================

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ==========================================
// USE AUTH HOOK
// ==========================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
};
