<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { ref, computed, watch } from "vue";
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
    min: any;
    max: any;
    step: any;
    customControl?: boolean;
    format?: string;
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
    min: 0,
    max: 4,
    step: 0.05,
    customControl: true,
    format: "",
  },
);

// Define the form schema using zod
const formSchema = toTypedSchema(
  z.object({
    duration: z.array(z.number()), // Array of numbers for the slider
  }).optional(),
);

// Use useForm to initialize the form
const { handleSubmit, setFieldValue, values, errors } = useForm({
  validationSchema: formSchema,
  initialValues: {
    duration: [props.name || 0], // Default value for the slider
  },
});

// Bind the slider value to the form field
const { value, errorMessage } = useField("duration");

// Create a computed property for displaying the value directly
const formattedValue = computed(() => {
  const val = value.value?.[0];
  if (val === undefined || val === null) return '';
  
  return val;
});

const debounce = ref(null);
const emit = defineEmits(['update']);

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
  const currentValue = value.value?.[0] || props.min;
  if (currentValue > props.min) {
    const newValue = Math.round((currentValue - props.step) * 100) / 100;
    setFieldValue("duration", [newValue]);
  }
};
</script>

<template>
  <FormField :name="'duration'">
    <FormItem>
      <FormLabel>{{ props.label || "Duration" }}</FormLabel>
      <Slider v-model="value" :min="props.min" :max="props.max" :step="props.step" :disabled="props.disabled" />
    </FormItem>
  </FormField>
  <div class="relative flex gap-6 justify-end">
    <div v-if="props.customControl" class="absolute bottom-[-27px] right-[70px] flex gap-2">
      <UiButton 
        type="button" 
        color="primary" 
        class="p-2" 
        size="xs" 
        @click="decrement" 
        :disabled="value?.[0] <= props.min || props.disabled"
      >-</UiButton>
      <UiButton 
        type="button" 
        color="primary" 
        size="xs" 
        @click="increment" 
        :disabled="value?.[0] >= props.max || props.disabled"
      >+</UiButton>
    </div>
    <div class="absolute bottom-[-27px] right-2 flex gap-2">
      <span style="text-align: end;">{{ formattedValue }}</span>
    </div>
  </div>
</template>