import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { authStorageKey, getAuthHeaders, serverBaseUrl } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const storedValue =
      typeof window !== "undefined" ? localStorage.getItem(authStorageKey) : null;
    return storedValue ? JSON.parse(storedValue) : { token: "", user: null };
  });
  const [loading, setLoading] = useState(Boolean(auth?.token));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (auth?.token) {
      localStorage.setItem(authStorageKey, JSON.stringify(auth));
    } else {
      localStorage.removeItem(authStorageKey);
    }
  }, [auth]);

  useEffect(() => {
    const hydrateAuth = async () => {
      if (!auth?.token) {
        setLoading(false);
        return;
      }

      try {
        const profilePath = auth.user?.role === "admin" ? "/auth/home" : "/auth/client/me";
        const response = await axios.get(`${serverBaseUrl}${profilePath}`, {
          headers: getAuthHeaders(auth.token),
        });

        setAuth((previous) => ({
          ...previous,
          user: response.data.user,
        }));
      } catch (error) {
        setAuth({ token: "", user: null });
      } finally {
        setLoading(false);
      }
    };

    hydrateAuth();
  }, []);

  const register = async (payload) => {
    const response = await axios.post(`${serverBaseUrl}/auth/client/register`, payload);
    setAuth({
      token: response.data.token,
      user: response.data.user,
    });
    return response.data;
  };

  const login = async (payload, role = "candidate") => {
    const endpoint = role === "admin" ? "/auth/login" : "/auth/client/login";
    const response = await axios.post(`${serverBaseUrl}${endpoint}`, payload);
    setAuth({
      token: response.data.token,
      user: response.data.user,
    });
    return response.data;
  };

  const logout = () => {
    setAuth({ token: "", user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        loading,
        isAuthenticated: Boolean(auth.token && auth.user),
        isAdmin: auth.user?.role === "admin",
        isCandidate: auth.user?.role === "candidate",
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
