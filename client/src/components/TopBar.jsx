import React from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { useAuth } from "../contexts/AuthContext";

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
    "& > a": {
      textDecoration: "none",
      color: "inherit"
    },
  },
});

function TopBar() {
  const classes = useStyles();
  const { logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <Link to="/">Calendar App</Link>
        </Typography>
        <Button color="inherit" onClick={logout}>
          Log Out
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
