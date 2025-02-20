import { reactive } from 'vue';

export function useDateOptions() {
  const dateOptions = reactive([
    { content: "Today", value: "today" },
    { content: "Yesterday", value: "yesterday" },
    { content: "Last 7 days", value: "last-7-days" },
    { content: "Last 30 days", value: "last-30-days" },
    { content: "Current month", value: "current-month" },
    { content: "Last month", value: "last-month" },
    { content: "Current year", value: "current-year" },
    { content: "Last year", value: "last-year" },
    { content: "Current financial year", value: "current-financial-year" },
    { content: "Last financial year", value: "last-financial-year" }
  ]);

  return { dateOptions };
}
