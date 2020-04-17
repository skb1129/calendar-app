import React, { useCallback, useState } from "react";

import { useSchedule } from "../contexts/ScheduleContext";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { weekdays } from "../constants/enums";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
}));

function ScheduleForm() {
  const classes = useStyles();
  const { schedule } = useSchedule();
  const [daysAvailable, setDaysAvailable] = useState(schedule.daysAvailable);
  const [startTime, setStartTime] = useState(schedule.startTime);
  const [endTime, setEndTime] = useState(schedule.endTime);

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

  return (
    <Container component="main" maxWidth="xs">
      <FormControl required component="form" className={classes.form}>
        <FormLabel component="legend">Available Weekdays: </FormLabel>
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
      </FormControl>
    </Container>
  );
}

export default ScheduleForm;
