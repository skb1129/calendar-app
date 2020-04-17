import React, { useState } from "react";
import DateFnsUtils from "@date-io/date-fns";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

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
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function EventForm() {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guestEmails, setGuestEmails] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.paper}>
        <Typography variant="h2">Create New Event</Typography>
        <form className={classes.form}>
          <Grid container spacing={3}>
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
          </Grid>
          {error && (
            <Typography color="error" variant="caption">
              {error}
            </Typography>
          )}
          <Button
            disabled={loading}
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
  );
}

export default EventForm;
