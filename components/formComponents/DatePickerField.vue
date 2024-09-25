<!-- CustomDatePicker.vue -->
<template>
  <UiFormField v-model="selectedDate" :name="name">
    <UiFormItem class="flex flex-col w-full">
      <UiFormLabel :class="{ 'text-[#ef4444]': hasError }">
        {{ label }}<UiLabel v-if="required" class="text-lg text-red-500">*</UiLabel>
      </UiFormLabel>
      <UiPopover>
        <UiPopoverTrigger as-child>
          <UiFormControl>
            <UiButton variant="outline" :class="cn(
              'ps-3 text-start font-normal',
                !value && 'text-muted-foreground',
              hasError ? 'border-[#ef4444]' : ''
            )">
              <span>{{ value ? df.format(toDate(value)) : placeholder }}</span>
              <!-- <span>{{ selectedDate ? selectedDate : placeholder }}</span> -->
              <UiCalendarIcon class="ms-auto h-4 w-4 opacity-50" />
            </UiButton>
            <input hidden>
          </UiFormControl>
        </UiPopoverTrigger>
        <UiPopoverContent class="w-auto p-0">
          <UiCalendar v-model="value" calendar-label="Date" initial-focus :min-value="today(getLocalTimeZone())"
            @update:model-value="(v) => updateDate(v)" />
        </UiPopoverContent>
      </UiPopover>
      <UiFormMessage class="text-xs text-red-500" />
      <span v-if="hasError" class="mt-0 text-xs text-[#ef4444]">{{ errorMessage }}</span>
      <span v-else class="mt-0 text-xs text-gray-500">{{ helperText }}</span>
    </UiFormItem>
  </UiFormField>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { ref, computed, watch } from 'vue';
import { CalendarDate, today, getLocalTimeZone, parseDate, DateFormatter } from '@internationalized/date';
import { toDate } from 'radix-vue/date'

// Define component props
const props = defineProps<{
  name: string,
  label?: string,
  placeholder?: string,
  required?: boolean,
  helperText?: string,
}>();

// Use vee-validate to handle form field and validation
const df = new DateFormatter('en-US', {
  month: 'short', // Use 'short' to get abbreviated month
  day: 'numeric',
  year: 'numeric',
})
const { value: fieldValue, errorMessage, meta } = useField(props.name);
// Define reactive date selection and error handling
const selectedDate = ref<any>(fieldValue.value);

// Watch for changes in selectedDate and update fieldValue accordingly
watch(selectedDate, (newValue) => {
  fieldValue.value = newValue;
});
const value = computed({
  get: () => fieldValue.value ? parseDate(fieldValue.value) : undefined,
  set: val => val,
})

// Check if the field has errors
const hasError = computed(() => meta.touched && errorMessage.value);

// Function to format the date for display
// const formatDate = (date: string | Date) => {
//   return format(date, "MMMM d, yyyy");
// };

// Function to handle date update
const updateDate = (date: CalendarDate) => {
  selectedDate.value = date?.toString() || null;
};
</script>
