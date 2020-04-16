import React from "react";
import { Route, Switch } from "react-router-dom";

import Container from "@material-ui/core/Container";

import Login from "./Login";
import Signup from "./Signup";

function App() {
  return (
    <Container>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </Container>
  );
}

export default App;
