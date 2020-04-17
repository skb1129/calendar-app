import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";

import api from "../utils/api";

const ScheduleContext = React.createContext({});

const useSchedule = () => useContext(ScheduleContext);

function ScheduleProvider({ children }) {
  const history = useHistory();
  const location = useLocation();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getSchedule = async () => {
      try {
        const { data } = await api.get("/schedule");
        data.schedule && setSchedule(data.schedule);
      } catch (e) {
        setError(e?.response?.data?.message || "An error occurred while fetching the schedule.");
      }
      setLoading(false);
    };
    getSchedule();
  }, []);

  useEffect(() => {
    loading && setLoading(false);
    error && setError("");
  }, [location.pathname]);

  const saveSchedule = useCallback(async (postData) => {
    setLoading(true);
    try {
      if (schedule) await api.put("/schedule", postData);
      else await api.post("/schedule", postData);
      setSchedule(postData);
      history.push("/");
    } catch (e) {
      setError(e?.response?.data?.message || "An error occurred while saving the schedule.");
    }
    setLoading(false);
  }, [schedule, setSchedule, setLoading, setError, history]);

  return (
    <ScheduleContext.Provider value={{ schedule, loading, error, saveSchedule }}>{children}</ScheduleContext.Provider>
  );
}

export { ScheduleContext, useSchedule, ScheduleProvider };
