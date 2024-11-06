// src/composables/useFormConfig.ts
import { ref } from "vue";

interface Validation {
  required: boolean;
}

interface FormField {
  type: string;
  model: string;
  label: string;
  placeholder?: string;
  options?: string[];
  validation: Validation;
}

export function useFormConfig() {
  const formConfig = ref<FormField[]>([
    {
      type: "text",
      model: "username",
      label: "Username",
      placeholder: "Enter your username",
      validation: { required: true },
    },
    {
      type: "email",
      model: "email",
      label: "Email",
      placeholder: "Enter your email",
      validation: { required: true },
    },
    {
      type: "select",
      model: "country",
      label: "Country",
      options: ["USA", "Canada", "UK"],
      validation: { required: true },
    },
    {
      type: "checkbox",
      model: "subscribe",
      label: "Subscribe to newsletter",
      validation: { required: false },
    },
  ]);

  return { formConfig };
}
