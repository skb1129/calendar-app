import React from "react";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import TopBar from "./TopBar";
import { useAuth } from "../contexts/AuthContext";

const DEFAULT_MESSAGE = "An internal server error occurred.";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

function Error({ location }) {
  const classes = useStyles();
  const { isAuthenticated } = useAuth();
  const message = new URLSearchParams(location.search).get("message") || DEFAULT_MESSAGE;
  return (
    <>
      {isAuthenticated && <TopBar />}
      <Container className={classes.root} component="main" maxWidth="xl">
        <Typography variant="h3" color="error">
          {message}
        </Typography>
      </Container>
    </>
  );
}

export default Error;
