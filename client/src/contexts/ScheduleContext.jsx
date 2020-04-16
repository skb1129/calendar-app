import React, { useContext, useEffect, useState } from "react";

import api from "../utils/api";

const ScheduleContext = React.createContext({});

const useSchedule = () => useContext(ScheduleContext);

function ScheduleProvider({ children }) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getSchedule = async () => {
      try {
        const { data } = await api.get("/schedule");
        data.schedule && setSchedule(data.schedule);
      } catch (e) {
        setError("An error occurred while fetching the schedule.");
      }
      setLoading(false);
    };
    getSchedule();
  }, []);

  return (
    <ScheduleContext.Provider value={{ schedule, loading, error }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export { ScheduleContext, useSchedule, ScheduleProvider };
