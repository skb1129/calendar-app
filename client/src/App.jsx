import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import ScheduleForm from "./components/ScheduleForm";
import TopBar from "./components/TopBar";
import { ScheduleProvider } from "./contexts/ScheduleContext";

function PrivateRoute({ component: Component, ...rest }) {
  const { isAuthenticated, loading } = useAuth();

  const render = (props) => {
    if (loading) return <CircularProgress size={40} />;
    if (isAuthenticated)
      return (
        <ScheduleProvider>
          <TopBar />
          <Component {...props} />
        </ScheduleProvider>
      );
    return <Redirect to="/login" />;
  };

  return <Route {...rest} render={render} />;
}

function App() {
  return (
    <AuthProvider>
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute exact path="/schedule" component={ScheduleForm} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Redirect to="/" />
      </Switch>
    </AuthProvider>
  );
}

export default App;
