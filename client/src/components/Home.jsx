import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import { blueGrey } from "@material-ui/core/colors";

import { useAuth } from "../contexts/AuthContext";
import Schedule from "./Schedule";
import TopBar from "./TopBar";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(10),
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(3),
    color: theme.palette.getContrastText(blueGrey[500]),
    backgroundColor: blueGrey[500],
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

function Home() {
  const classes = useStyles();
  const { user } = useAuth();

  return (
    <>
      <TopBar />
      <Container component="main">
        <Grid container direction="row" alignItems="center" className={classes.paper}>
          <Grid item>
            <Avatar className={classes.avatar}>
              {user.firstName && user.firstName.charAt(0)}
              {user.lastName && user.lastName.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h4">{`${user.firstName} ${user.lastName}`}</Typography>
            <Typography variant="subtitle1">@{user.username}</Typography>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        {user.email && (
          <Typography variant="body1">
            <Typography component="span" variant="h6">
              E-mail:&nbsp;
            </Typography>
            <Typography component="span">{user.email}</Typography>
          </Typography>
        )}
        <Schedule />
      </Container>
    </>
  );
}

export default Home;
