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
      min:'',
      max:'',
      step:'',
    },
  );

  // Define the form schema using zod
  const formSchema = toTypedSchema(
    z.object({
      duration:  z.array(z.number()), // Array of numbers for the slider
    }).optional(),
  );

  // Use useForm to initialize the form
  const { handleSubmit, values, errors } = useForm({
    validationSchema: formSchema,
    initialValues: {
      duration: [props.name  || 0], // Default value for the slider
    },
  });

  // Bind the slider value to the form field
  const { value, errorMessage } = useField("duration");

  const debounce = ref(null);
  const emit = defineEmits(['update'])
  watch(value, (newValue) => {
    clearTimeout(debounce.value);
    debounce.value = setTimeout(() => {
      emit("update", newValue[0]);
    }, 1000);
  });
</script>

<template>
  <FormField :name="'duration'">
    <FormItem>
      <FormLabel>{{ props.label || "Duration" }}</FormLabel>
      <Slider v-model="value" :default-value="[0]" :max="max"  :step="step"  />
    </FormItem>
  </FormField>
        <span style="text-align: end;">{{ value?.[0] }}</span>

</template>
