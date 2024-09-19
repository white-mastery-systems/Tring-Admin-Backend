// utils/timeConversions.ts

export const convertTo12HourFormat = (time24: string): string => {
  let [hours, minutes] = time24.split(":");
  hours = parseInt(hours);

  const period = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour format to 12-hour format
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}

export const convertToUTC = (timeString: string): string => {
  // Parse the time string
  const [time, modifier] = timeString.split(' '); // Split into time and modifier (AM/PM)
  const [hours, minutes] = time.split(':').map(Number); // Get hours and minutes as numbers

  // Create a new Date object
  const date = new Date();
  date.setHours(modifier === 'PM' ? hours + 12 : hours, minutes, 0, 0); // Set hours based on AM/PM

  // Convert to UTC and return
  return date.toISOString(); // Returns the time in UTC format
}
