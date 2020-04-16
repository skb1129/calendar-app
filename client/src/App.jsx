import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Redirect to="/" />
    </Switch>
  );
}

export default App;
