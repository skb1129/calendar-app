import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";

function PrivateRoute({ component: Component, ...rest }) {
  const { isAuthenticated, loading } = useAuth();

  const render = (props) => {
    if (loading) return <CircularProgress size={40} />;
    if (isAuthenticated) return <Component {...props} />;
    return <Redirect to="/login" />;
  };

  return <Route {...rest} render={render} />;
}

function App() {
  return (
    <AuthProvider>
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Redirect to="/" />
      </Switch>
    </AuthProvider>
  );
}

export default App;
