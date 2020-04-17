import React from "react";

import { useSchedule } from "../contexts/ScheduleContext";

function ScheduleForm() {
  const { schedule } = useSchedule();
  return <div>{JSON.stringify(schedule)}</div>;
}

export default ScheduleForm;
