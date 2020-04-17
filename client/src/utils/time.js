export function padStart(num) {
  if (typeof num !== "number") return "";
  return num.toString().padStart(2, "0");
}

export function formatTime(time) {
  if (!time) return time;
  let [hh, mm] = time.split(":").map((str) => Number(str));
  let meridian = "AM";
  if (!hh) {
    hh = 12;
  } else if (hh > 12) {
    hh -= 12;
    meridian = "PM";
  }
  return `${padStart(hh)}:${padStart(mm)} ${meridian}`;
}
