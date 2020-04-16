import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
});

function TopBar() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Dashboard
        </Typography>
        <Button color="inherit">Log Out</Button>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
