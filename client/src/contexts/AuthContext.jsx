import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";

import api from "../utils/api";

const AuthContext = React.createContext({});

const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const history = useHistory();
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const onLoginSuccess = useCallback(
    (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
      setIsAuthenticated(true);
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      localStorage.setItem("accessToken", data.accessToken);
      history.replace("/");
    },
    [setUser, setAccessToken, setIsAuthenticated, history]
  );

  const logout = useCallback(() => {
    loading && setLoading(false);
    isAuthenticated && setIsAuthenticated(false);
    accessToken && setAccessToken("");
    user && user.username && setUser({});
    localStorage.removeItem("accessToken");
    delete api.defaults.headers.common.Authorization;
    history.push("/login");
  }, [loading, setLoading, isAuthenticated, setIsAuthenticated, accessToken, setAccessToken, user, setUser, history]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return logout();
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      try {
        const { data } = await api.post("/check-auth");
        onLoginSuccess({ ...data, accessToken: token });
        setLoading(false);
      } catch (e) {
        logout();
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, onLoginSuccess, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, useAuth, AuthProvider };
