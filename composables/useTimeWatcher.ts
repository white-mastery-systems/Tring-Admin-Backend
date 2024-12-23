import { watch } from 'vue';

export function useTimeWatcher(values: { startTime: string; endTime: string }, setFieldValue: (field: string, value: string) => void) {
  watch(
    () => values.endTime,
    (newEndTime) => {

      const [endHours, endMinutes] = newEndTime.split(':').map(Number);
      const [startHours, startMinutes] = values.startTime.split(':').map(Number);

      // Convert time to minutes for easy comparison
      const endTimeInMinutes = endHours * 60 + endMinutes;
      const startTimeInMinutes = startHours * 60 + startMinutes;

      if (startTimeInMinutes >= endTimeInMinutes) {
        // Adjust start time to be less than the end time
        const adjustedTime = endTimeInMinutes - 1; // 1 minute before the end time
        const adjustedHours = Math.floor(adjustedTime / 60);
        const adjustedMinutes = adjustedTime % 60;
        const adjustedStartTime = `${String(adjustedHours).padStart(2, '0')}:${String(adjustedMinutes).padStart(2, '0')}`;

        setFieldValue('startTime', adjustedStartTime);
      }
    }
  );
}
