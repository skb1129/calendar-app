import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import { weekdays } from "../constants/enums";
import { useSchedule } from "../contexts/ScheduleContext";
import { formatTime } from "../utils/time";

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

function Schedule() {
  const classes = useStyles();
  const { schedule, loading, error } = useSchedule();

  if (loading) return <CircularProgress size={40} />;

  if (error)
    return (
      <Typography variant="body1" color="error">
        {error}
      </Typography>
    );

  if (!schedule)
    return (
      <Button variant="contained" color="primary" className={classes.button}>
        Create Schedule
      </Button>
    );

  return (
    <Grid container direction="column" alignItems="flex-start">
      <Typography className={classes.title} variant="h5">
        Your Schedule:&nbsp;
      </Typography>
      <Grid item>
        <Typography variant="body1">
          <Typography component="span" variant="h6">
            From:&nbsp;
          </Typography>
          <Typography component="span">{formatTime(schedule.startTime)}</Typography>
          <Typography component="span" variant="h6">
            &nbsp;To:&nbsp;
          </Typography>
          <Typography component="span">{formatTime(schedule.endTime)}</Typography>
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h6">
          Weekdays:&nbsp;
          <Typography component="span" variant="body1">
            {schedule.daysAvailable.map((weekday) => weekdays[weekday]).join(", ")}
          </Typography>
        </Typography>
      </Grid>
      <Button variant="contained" color="primary" className={classes.button}>
        Edit Schedule
      </Button>
    </Grid>
  );
}

export default Schedule;
