export function convertMillisecondsToHHMMSS(ms) {
  // console.log(ms);
  let totalSeconds = Math.floor(ms / 1000);

  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  // Format hours, minutes, and seconds to two digits
  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${hours}:${minutes}:${seconds}`;
}

export function millisecondsToHMSConverter(ms) {
  let totalSeconds = Math.floor(ms / 1000);

  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  // Return the formatted string: "x h - x m - x s"
  return `${hours}h ${minutes}m ${seconds}s`;
}
