import React, { useCallback, useContext, useState } from "react";

import api from "../utils/api";

const AuthContext = React.createContext({});

const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState("");

  const onLoginSuccess = useCallback(
    (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      localStorage.setItem("accessToken", data.accessToken);
    },
    [setUser, setAccessToken]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    delete api.defaults.headers.common.Authorization;
    window.location.pathname = "/login";
  }, []);

  return <AuthContext.Provider value={{ user, accessToken, onLoginSuccess, logout }}>{children}</AuthContext.Provider>;
}

export { AuthContext, useAuth, AuthProvider };
