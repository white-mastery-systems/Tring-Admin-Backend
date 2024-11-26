<script setup lang="ts">
  import { useForm, useField } from "vee-validate";
  import { toTypedSchema } from "@vee-validate/zod";
  import { z } from "zod";
  import { ref } from "vue";
  import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Slider } from "@/components/ui/slider";

  // Define props with default values
  const props = withDefaults(
    defineProps<{
      label?: string;
      name: any;
      type?: string;
      helperText?: string;
      placeholder?: string;
      required?: boolean;
      disableCharacters?: boolean;
      isTextarea: boolean;
      disabled?: boolean;
      class?: string;
      endIcon?: any;
      min:any,
      max:any,
      step:any,
    }>(),
    {
      label: "",
      type: "text",
      helperText: "",
      placeholder: "",
      required: false,
      disableCharacters: false,
      isTextarea: false,
      disabled: false,
      class: "",
      min:0,
      max:4,
      step:0.05,
    },
  );

  // Define the form schema using zod
  const formSchema = toTypedSchema(
    z.object({
      duration:  z.array(z.number()), // Array of numbers for the slider
    }).optional(),
  );

  // Use useForm to initialize the form
const { handleSubmit, setFieldValue, values, errors } = useForm({
    validationSchema: formSchema,
    initialValues: {
      duration: [props.name ||0], // Default value for the slider
    },
  });

  // Bind the slider value to the form field
  const { value, errorMessage } = useField("duration");

  const debounce = ref(null);
  const emit = defineEmits(['update'])
  watch(
    () => props.name,
    (newValue) => {
      // Update the form value when prop changes
      setFieldValue("duration", [newValue]);
    },
    { immediate: true } // Immediate update when the component is mounted
  );

  watch(value, (newValue) => {
    clearTimeout(debounce.value);
    debounce.value = setTimeout(() => {
      emit("update", newValue[0]);
    }, 1000);
  });

// Increment and decrement methods
const increment = () => {
  const currentValue = value.value?.[0] || props.min;
  if (currentValue < props.max) {
    const newValue = Math.round((currentValue + props.step) * 100) / 100;
    setFieldValue("duration", [newValue]);
  }
};

const decrement = () => {
  const currentValue = value.value?.[0] || props.min; // Declare currentValue before usage
  if (currentValue > props.min) { // Check boundary condition
    const newValue = Math.round((currentValue - props.step) * 100) / 100; // Ensure proper rounding
    setFieldValue("duration", [newValue]); // Update the slider value
  }
};
</script>

<template>
  <FormField :name="'duration'">
    <FormItem>
      <FormLabel>{{ props.label || "Duration" }}</FormLabel>
      <Slider v-model="value" :min="0" :max="max" :step="step" />
    </FormItem>
  </FormField>
  <div class="relative flex gap-6 justify-end">
    <div class="absolute bottom-[-27px] right-[70px] flex gap-2">
      <UiButton type="button" color="primary" class="p-2" size="xs" @click="decrement" :disabled="value?.[0] <= min">-</UiButton>
      <UiButton type="button" color="primary" size="xs" @click="increment" :disabled="value?.[0] >= max">+</UiButton>
    </div>
    <div class="absolute bottom-[-27px] right-2 flex gap-2">
      <span style="text-align: end;">{{ value?.[0] }}</span>
    </div>
  </div>
</template>