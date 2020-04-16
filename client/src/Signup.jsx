import React, { useCallback, useState } from "react";
import { Link as RouteLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import api from "./utils/api";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Signup() {
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!firstName || !lastName || !username || !email || !password) return;
    try {
      await api.post("/register", { firstName, lastName, username, email, password });
    } catch (e) {
      setError("An error occurred while trying to log in.");
    }
  }, [firstName, lastName, username, email, password, setError]);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography variant="h2">Sign up</Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                name="firstName"
                variant="outlined"
                label="First Name"
                autoComplete="fname"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                name="lastName"
                variant="outlined"
                label="Last Name"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                name="username"
                variant="outlined"
                label="Username"
                autoComplete="username"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                name="email"
                variant="outlined"
                label="Email Address"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                name="password"
                variant="outlined"
                label="Password"
                autoComplete="new-password"
                type="password"
              />
            </Grid>
          </Grid>
          {error && <Typography color="error" variant="caption">{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link component={RouteLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default Signup;
