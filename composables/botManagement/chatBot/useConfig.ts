import { ref } from 'vue';

export const useConfig = () => {
  const roles = ref([
    {
      helperText: "Handles sales inquiries and closes deals.",
      label: "Sales Executive",
      value: "Sales Executive",
    },
    {
      helperText: "Provides assistance and resolves customer issues.",
      label: "Customer Support Representative",
      value: "Customer Support Representative",
    },
    {
      helperText: "Performs miscellaneous tasks as required.",
      label: "Other",
      value: "Other",
    },
  ]);

  const goals = ref([
    {
      helperText: "Assist customers with their questions and issues.",
      label: "Customer Support",
      value: "Customer Support",
    },
    {
      helperText: "Collect feedback from users to improve services.",
      label: "Feedback Collection",
      value: "Feedback Collection",
    },
    {
      helperText: "Manage appointments and schedule meetings.",
      label: "Appointment Scheduling",
      value: "Appointment Scheduling",
    },
    {
      helperText: "Provide education or training on specific topics.",
      label: "Education/Training",
      value: "Education/Training",
    },
    {
      helperText: "Perform other custom tasks as needed.",
      label: "Other",
      value: "Other",
    },
  ]);

  return { roles, goals };
};
