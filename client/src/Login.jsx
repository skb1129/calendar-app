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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login() {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!username || !password) return;
    try {
      await api.post("/login", { username, password });
    } catch (e) {
      setError("An error occurred while trying to log in.");
    }
  }, [username, password, setError]);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography variant="h2">Log in</Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <TextField
            required
            fullWidth
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            variant="outlined"
            margin="normal"
            label="Username"
            name="username"
            autoComplete="username"
          />
          <TextField
            required
            fullWidth
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            variant="outlined"
            margin="normal"
            label="Password"
            name="password"
            autoComplete="current-password"
            type="password"
          />
          {error && <Typography color="error" variant="caption">{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Log in
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouteLink} to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default Login;
