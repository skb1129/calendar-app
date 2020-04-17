import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import { orange } from "@material-ui/core/colors";

import api from "../utils/api";
import { getDateObject } from "../utils/event";
import { formatTime } from "../utils/time";

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  card: {
    padding: theme.spacing(1),
    color: theme.palette.getContrastText(orange[500]),
    backgroundColor: orange[500],
    width: 275,
    marginTop: theme.spacing(1),
  },
}));

function Events() {
  const classes = useStyles();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getEvents = async () => {
      try {
        const { data } = await api.get("/event");
        data.events && setEvents(data.events);
      } catch (e) {
        setError(e?.response?.data?.message || "An error occurred while fetching the events.");
      }
      setLoading(false);
    };
    getEvents();
  }, []);

  const getCreateButton = () => (
    <Button component={Link} to="/event" variant="contained" color="primary" className={classes.button}>
      Create New Event
    </Button>
  );

  if (loading) return <CircularProgress size={40} />;

  if (error)
    return (
      <Typography variant="body1" color="error">
        {error}
      </Typography>
    );

  if (!events.length) return getCreateButton();

  const pastEvents = events.filter((event) => getDateObject(event) <= new Date());
  const upcomingEvents = events.filter((event) => getDateObject(event) > new Date());

  return (
    <Grid container direction="column" alignItems="flex-start">
      <Typography className={classes.title} variant="h5">
        Events:&nbsp;
      </Typography>
      <Grid container direction="row" spacing={5}>
        <Grid item>
          <Typography variant="h6">Past Events: </Typography>
          {pastEvents.map((event) => (
            <Card className={classes.card} variant="outlined">
              <Typography variant="h6">{event.name}</Typography>
              <Typography variant="body1">{event.description}</Typography>
              <Typography variant="subtitle1">Date: {event.date}</Typography>
              <Typography variant="subtitle2">Starting at: {formatTime(event.startTime)}</Typography>
              <Typography variant="subtitle2">Ending at: {formatTime(event.endTime)}</Typography>
              <Typography variant="h6">Guests:</Typography>
              <Typography variant="body2">{event.guestEmails.join(", ")}</Typography>
            </Card>
          ))}
        </Grid>
        <Grid item>
          <Typography variant="h6">Upcoming Events: </Typography>
          {upcomingEvents.map((event) => (
            <Card className={classes.card} elevation={3}>
              <Typography variant="h6">{event.name}</Typography>
              <Typography variant="body1">{event.description}</Typography>
              <Typography variant="subtitle1">Date: {event.date}</Typography>
              <Typography variant="subtitle2">Starting at: {formatTime(event.startTime)}</Typography>
              <Typography variant="subtitle2">Ending at: {formatTime(event.endTime)}</Typography>
              <Typography variant="h6">Guests:</Typography>
              <Typography variant="body2">{event.guestEmails.join(", ")}</Typography>
            </Card>
          ))}
        </Grid>
      </Grid>
      {getCreateButton()}
    </Grid>
  );
}

export default Events;
