<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";

// Props
const props = defineProps<{
  selectedHour?: string;
  selectedMinute?: string;
  selectedMeridiem?: string;
  selectedDate?: DateValue;
}>();

// Emit function
const emit = defineEmits(['update:selectedHour', 'update:selectedMinute', 'update:selectedMeridiem', 'update:selectedDate']);

// Reactive state
const selectedHour = ref(props.selectedHour || "");
const selectedMinute = ref(props.selectedMinute || "");
const selectedMeridiem = ref(props.selectedMeridiem || "");
const selectedDate = ref<DateValue | null>(props.selectedDate || null);

// Watch for changes and emit updated values
watch(selectedHour, (newVal) => {
  emit('update:selectedHour', newVal);
});
watch(selectedMinute, (newVal) => {
  emit('update:selectedMinute', newVal);
});
watch(selectedMeridiem, (newVal) => {
  emit('update:selectedMeridiem', newVal);
});
watch(selectedDate, (newVal) => {
  emit('update:selectedDate', newVal);
});

// Computed values
const hours = computed(() => Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")));
const minutes = computed(() => ["00", "15", "30", "45"]);
const meridians = computed(() => ["AM", "PM"]);
</script>

<template>
  <div class="space-y-2">
    <div class="flex gap-2">
      <UiSelect v-model="selectedHour">
        <UiSelectTrigger class="px-1 focus:ring-offset-0 focus-visible:ring-offset-0 sm:px-3 text-[10px]">
          <UiSelectValue placeholder="HH" />
        </UiSelectTrigger>
        <UiSelectContent class="h-[160px]">
          <UiSelectGroup>
            <UiSelectItem v-for="hour in hours" :key="hour" :value="hour">
              {{ hour }}
            </UiSelectItem>
          </UiSelectGroup>
        </UiSelectContent>
      </UiSelect>

      <UiSelect v-model="selectedMinute">
        <UiSelectTrigger class="px-1 focus:ring-offset-0 focus-visible:ring-offset-0 sm:px-3 text-[10px]">
          <UiSelectValue placeholder="MM" />
        </UiSelectTrigger>
        <UiSelectContent class="h-[160px]">
          <UiSelectGroup>
            <UiSelectItem v-for="minute in minutes" :key="minute" :value="minute">
              {{ minute }}
            </UiSelectItem>
          </UiSelectGroup>
        </UiSelectContent>
      </UiSelect>

      <UiSelect v-model="selectedMeridiem">
        <UiSelectTrigger class="px-1 focus:ring-offset-0 focus-visible:ring-offset-0 sm:px-3 text-[10px]">
          <UiSelectValue placeholder="AM/PM" />
        </UiSelectTrigger>
        <UiSelectContent>
          <UiSelectGroup>
            <UiSelectItem v-for="meridiem in meridians" :key="meridiem" :value="meridiem">
              {{ meridiem }}
            </UiSelectItem>
          </UiSelectGroup>
        </UiSelectContent>
      </UiSelect>
    </div>
  </div>
</template>
