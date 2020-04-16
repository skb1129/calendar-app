import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { useSchedule } from "../contexts/ScheduleContext";

const useStyles = makeStyles((theme) => ({
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

  return <div>{JSON.stringify(schedule)}</div>;
}

export default Schedule;
