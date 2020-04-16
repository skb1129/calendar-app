import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import { useAuth } from "../contexts/AuthContext";
import TopBar from "./TopBar";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function Home() {
  const classes = useStyles();
  const { user } = useAuth();

  return (
    <>
      <TopBar />
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography variant="h2">{`${user.firstName} ${user.lastName}`}</Typography>
        </div>
      </Container>
    </>
  );
}

export default Home;
