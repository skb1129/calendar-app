import React, { useCallback, useEffect, useState } from "react";

import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import { weekdays } from "../constants/enums";
import { useSchedule } from "../contexts/ScheduleContext";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  label: {
    marginBottom: theme.spacing(3),
  },
  input: {
    display: "block",
    marginBottom: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(3),
  },
}));

function ScheduleForm() {
  const classes = useStyles();
  const { schedule, loading, saveSchedule, error } = useSchedule();
  const [daysAvailable, setDaysAvailable] = useState((schedule && schedule.daysAvailable) || []);
  const [startTime, setStartTime] = useState((schedule && schedule.startTime) || "");
  const [endTime, setEndTime] = useState((schedule && schedule.endTime) || "");

  useEffect(() => {
    schedule && schedule.daysAvailable && setDaysAvailable(schedule.daysAvailable);
    schedule && schedule.startTime && setStartTime(schedule.startTime);
    schedule && schedule.endTime && setEndTime(schedule.endTime);
  }, [schedule]);

  const handleChange = useCallback(
    ({ target }) => {
      const value = Number(target.name);
      let updatedWeekdays = [...daysAvailable];
      if (target.checked) {
        updatedWeekdays.push(value);
      } else {
        const index = updatedWeekdays.indexOf(value);
        index >= 0 && updatedWeekdays.splice(index, 1);
      }
      setDaysAvailable(updatedWeekdays);
    },
    [daysAvailable, setDaysAvailable]
  );

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (daysAvailable.length && startTime && endTime && startTime < endTime)
        saveSchedule({ daysAvailable, startTime, endTime });
    },
    [saveSchedule, daysAvailable, startTime, endTime]
  );

  const valid = daysAvailable.length && startTime && endTime && startTime < endTime;

  return (
    <Container component="main" maxWidth="xs">
      <FormControl required component="form" onSubmit={onSubmit} className={classes.form}>
        <Grid container spacing={10}>
          <Grid item>
            <FormLabel className={classes.label} component="legend">
              Available Weekdays:{" "}
            </FormLabel>
            <FormGroup>
              {weekdays.map((weekday, index) => (
                <FormControlLabel
                  key={weekday}
                  control={
                    <Checkbox checked={daysAvailable.includes(index)} onChange={handleChange} name={String(index)} />
                  }
                  label={weekday}
                />
              ))}
            </FormGroup>
          </Grid>
          <Grid item>
            <FormLabel className={classes.label} component="legend">
              Schedule Timings:{" "}
            </FormLabel>
            <TextField
              className={classes.input}
              label="Start time"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />
            <TextField
              className={classes.input}
              label="End Time"
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
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
          disabled={!valid || loading}
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
        >
          {loading ? <CircularProgress size={24} /> : "Save Schedule"}
        </Button>
      </FormControl>
    </Container>
  );
}

export default ScheduleForm;
