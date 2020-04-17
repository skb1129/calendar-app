export function getDateObject(event) {
  if (!event || !event.date || !event.startTime || !event.endTime) return null;
  const date = new Date(event.date);
  let [hh, mm] = event.startTime.split(":").map((str) => Number(str));
  date.setHours(hh, mm, 0, 0);
  return date;
}
