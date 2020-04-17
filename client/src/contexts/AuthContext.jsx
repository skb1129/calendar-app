import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";

import api from "../utils/api";

const AuthContext = React.createContext({});

const useAuth = () => useContext(AuthContext);

function AuthProvider({ privateRoutes, openRoutes, children }) {
  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const onLoginSuccess = useCallback(
    (data, location = null) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
      setIsAuthenticated(true);
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      localStorage.setItem("accessToken", data.accessToken);
      history.replace(location || "/");
    },
    [setUser, setAccessToken, setIsAuthenticated, history]
  );

  const logout = useCallback((location = null) => {
    loading && setLoading(false);
    isAuthenticated && setIsAuthenticated(false);
    accessToken && setAccessToken("");
    user && user.username && setUser({});
    localStorage.removeItem("accessToken");
    delete api.defaults.headers.common.Authorization;
    history.push(location || "/login");
  }, [loading, setLoading, isAuthenticated, setIsAuthenticated, accessToken, setAccessToken, user, setUser, history]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return logout(openRoutes.includes(location.pathname) ? location : null);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      try {
        const { data } = await api.post("/check-auth");
        onLoginSuccess({ ...data, accessToken: token }, privateRoutes.includes(location.pathname) ? location : null);
        setLoading(false);
      } catch (e) {
        logout(openRoutes.includes(location.pathname) ? location : null);
      }
    };
    checkAuth();
    api.interceptors.response.use(null, (error) => {
      if (error.response.status === 401) return logout();
      return Promise.reject(error);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, onLoginSuccess, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, useAuth, AuthProvider };
