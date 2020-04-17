import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ScheduleProvider } from "./contexts/ScheduleContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import ScheduleForm from "./components/ScheduleForm";
import TopBar from "./components/TopBar";
import EventForm from "./components/EventForm";

const PRIVATE_ROUTES = {
  HOME: "/",
  SCHEDULE: "/schedule",
  EVENT: "/event",
};

const OPEN_ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  EVENT: "/event",
};

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
    <AuthProvider privateRoutes={Object.values(PRIVATE_ROUTES)} openRoutes={Object.values(OPEN_ROUTES)}>
      <Switch>
        <PrivateRoute exact path={PRIVATE_ROUTES.HOME} component={Home} />
        <PrivateRoute exact path={PRIVATE_ROUTES.SCHEDULE} component={ScheduleForm} />
        <Route exact path={OPEN_ROUTES.LOGIN} component={Login} />
        <Route exact path={OPEN_ROUTES.SIGNUP} component={Signup} />
        <Route exact path={OPEN_ROUTES.EVENT} component={EventForm} />
        <Redirect to="/" />
      </Switch>
    </AuthProvider>
  );
}

export default App;
