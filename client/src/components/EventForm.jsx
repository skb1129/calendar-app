import React, { useCallback, useEffect, useState } from "react";
import format from "date-fns/format";

import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import api from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import TopBar from "./TopBar";

const initialDate = new Date();
initialDate.setHours(0, 0, 0, 0);

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
    marginBottom: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  flex: {
    display: "flex",
  },
  emailInput: {
    width: "100%",
    marginRight: theme.spacing(1),
  },
}));

function EventForm({ location, history }) {
  const classes = useStyles();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guestEmails, setGuestEmails] = useState([""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const username = new URLSearchParams(location.search).get("username") || "";

  useEffect(() => {
    if (authLoading) return;
    if (username) return;
    if (user.username) {
      history.push({ ...location, search: `?username=${user.username}` });
      return;
    }
    history.push("/error?message=Invalid link for event creation.");
  }, [authLoading]);

  const valid =
    username &&
    name &&
    description &&
    selectedDate &&
    selectedDate >= initialDate &&
    startTime &&
    endTime &&
    startTime < endTime &&
    guestEmails.length &&
    guestEmails.reduce((acc, cv) => acc && cv, true);

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!valid) return;
      setLoading(true);
      try {
        await api.post("/event", {
          username,
          name,
          description,
          date: format(selectedDate, "yyyy-MM-dd"),
          startTime,
          endTime,
          guestEmails,
        });
        setLoading(false);
      } catch (e) {
        setError("An error occurred while trying to create event.");
        setLoading(false);
      }
    },
    [username, valid, setLoading, name, description, selectedDate, startTime, endTime, guestEmails]
  );

  return (
    <>
      {isAuthenticated && <TopBar />}
      <Container component="main" maxWidth="md">
        <div className={classes.paper}>
          <Typography variant="h2">Create New Event</Typography>
          <form className={classes.form} onSubmit={onSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  disabled
                  required
                  fullWidth
                  value={username}
                  name="username"
                  variant="outlined"
                  label="Username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  name="name"
                  variant="outlined"
                  label="Event Name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  name="description"
                  variant="outlined"
                  label="Description"
                />
              </Grid>
              <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    minDate={initialDate}
                    minDateMessage="Event date should be a future date."
                    margin="normal"
                    label="Event Date"
                    format="MM/dd/yyyy"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    fullWidth
                    inputVariant="outlined"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start time"
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 1800, // 30 min
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 1800, // 30 min
                  }}
                />
              </Grid>
              {Object.keys(guestEmails).map((key) => {
                const state = [...guestEmails];
                return (
                  <Grid className={classes.flex} item xs={12} key={key}>
                    <TextField
                      required
                      className={classes.emailInput}
                      value={guestEmails[key]}
                      onChange={(event) => {
                        state[key] = event.target.value;
                        setGuestEmails(state);
                      }}
                      name={`guest_email_${key}`}
                      variant="outlined"
                      label={`Guest Email ${key}`}
                    />
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        state.splice(Number(key), 1);
                        setGuestEmails(state);
                      }}
                    >
                      Remove
                    </Button>
                  </Grid>
                );
              })}
              <Grid className={classes.flex} item xs={12} alignItems="flex-end">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setGuestEmails([...guestEmails].concat([""]))}
                >
                  Add Guest Email
                </Button>
              </Grid>
            </Grid>
            {error && (
              <Typography color="error" variant="caption">
                {error}
              </Typography>
            )}
            <Button
              disabled={!valid || loading}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {loading ? <CircularProgress size={24} /> : "Create Event"}
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
}

export default EventForm;
