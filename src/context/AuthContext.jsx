import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        setToken(storedToken);
        try {
          // Coba ambil user terbaru dari server
          const response = await apiClient.get("/profile");
          setUser(response.data);
          localStorage.setItem("authUser", JSON.stringify(response.data));
        } catch (error) {
          // Jika token expired/invalid, logout otomatis
          console.error("Token invalid:", error);
          forceLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, userToken) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem("authToken", userToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  // Fungsi Logout yang LEBIH BERSIH
  const logout = async () => {
    try {
      // Opsional: Beritahu server untuk hapus token
      await apiClient.post("/logout"); 
    } catch (e) {
      // Hiraukan error jika server down/token expired, tetap logout di frontend
    } finally {
      forceLogout();
    }
  };

  // Fungsi pembantu untuk membersihkan state
  const forceLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};