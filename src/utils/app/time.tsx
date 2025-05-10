import { jwtDecode } from "jwt-decode";
/**
 * Creates a countdown timer string in the format HH:MM:SS from a given number of seconds.
 *
 * @param {number} seconds - The total number of seconds to convert into a countdown string.
 * @returns {string} A string representing the countdown in the format HH:MM:SS.
 *
 * @example
 * ```typescript
 * const countdown = createCountdown(3661);
 * console.log(countdown); // "01:01:01"
 * ```
 */
export function createCountdown(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const hoursString = hours.toString().padStart(2, "0");
  const minutesString = minutes.toString().padStart(2, "0");
  const secondsString = remainingSeconds.toString().padStart(2, "0");

  return hours
    ? `${hoursString}:${minutesString}:${secondsString}`
    : `${minutesString}:${secondsString}`;
}

export const isTokenExpired = (token: string) => {
  if (!token) return true;

  const {exp} = jwtDecode(token);
  const currentTime = Date.now() / 1000; // current time in seconds
  // console.log(decodedToken.exp);
  return exp! < currentTime;
};

export function getDateObject(daysOffset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset); // Add or subtract days

  return {
    calendar: "gregory",
    era: "ce",
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: "numeric", 
    month: "short", 
    day: "numeric", 
    hour: "2-digit", 
    minute: "2-digit", 
  };
  return new Date(dateString).toLocaleString(undefined, options);
};