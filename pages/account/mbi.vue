<template>
  <div class="mui-style-datetime-picker">
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          class="w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{
            selectedDateTime
              ? format(selectedDateTime, "PPP p")
              : "Pick date and time"
          }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <div class="p-4">
          <div class="mb-4 flex items-center justify-between">
            <Button variant="ghost" size="sm" @click="view = 'date'">
              {{
                selectedDateTime
                  ? format(selectedDateTime, "PPP")
                  : "Select date"
              }}
            </Button>
            <Button variant="ghost" size="sm" @click="view = 'time'">
              {{
                selectedDateTime ? format(selectedDateTime, "p") : "Select time"
              }}
            </Button>
          </div>
          <div v-if="view === 'date'">
            <Calendar
              mode="single"
              v-model="selectedDate"
              class="rounded-md border"
            />
          </div>
          <div v-else-if="view === 'time'" class="clock-interface">
            <div
              class="clock-face"
              @mousedown="startDrag"
              @mousemove="drag"
              @mouseup="stopDrag"
              @mouseleave="stopDrag"
            >
              <div class="clock-center"></div>
              <div class="clock-hand" :style="clockHandStyle"></div>
              <div
                v-for="hour in 12"
                :key="hour"
                class="clock-number"
                :style="getNumberPosition(hour)"
              >
                {{ hour }}
              </div>
            </div>
            <div class="time-display">
              {{ format(selectedDateTime || new Date(), "hh:mm a") }}
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 bg-gray-100 p-4">
          <Button variant="outline" @click="closePopover">Cancel</Button>
          <Button @click="confirmSelection">OK</Button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import { Calendar } from "@/components/ui/calendar";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  import { format, setHours, setMinutes } from "date-fns";
  import { CalendarIcon } from "lucide-vue-next";
  import { computed, ref } from "vue";

  const selectedDateTime = ref<Date | null>(null);
  const selectedDate = ref<Date | null>(null);
  const view = ref<"date" | "time">("date");
  const isDragging = ref(false);
  const angle = ref(0);

  const clockHandStyle = computed(() => ({
    transform: `rotate(${angle.value}deg)`,
  }));

  const getNumberPosition = (number: number) => {
    const angleRad = (number / 12) * 2 * Math.PI - Math.PI / 2;
    const x = Math.cos(angleRad) * 80 + 100;
    const y = Math.sin(angleRad) * 80 + 100;
    return {
      left: `${x}px`,
      top: `${y}px`,
    };
  };

  const startDrag = (event: MouseEvent) => {
    isDragging.value = true;
    updateAngle(event);
  };

  const drag = (event: MouseEvent) => {
    if (isDragging.value) {
      updateAngle(event);
    }
  };

  const stopDrag = () => {
    isDragging.value = false;
  };

  const updateAngle = (event: MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    angle.value = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle.value < 0) angle.value += 360;

    const hours = Math.round(angle.value / 30) % 12;
    const minutes = Math.round((angle.value % 30) / 6) * 5;

    selectedDateTime.value = setMinutes(
      setHours(selectedDateTime.value || new Date(), hours),
      minutes,
    );
  };

  const confirmSelection = () => {
    // Here you would typically emit the selected date and time to the parent component

    closePopover();
  };

  const closePopover = () => {
    // Close the popover (you might need to implement this based on your Popover component)
  };

  // Watch for changes in selectedDate and update selectedDateTime
  watch(selectedDate, (newDate) => {
    if (newDate) {
      selectedDateTime.value = newDate;
    }
  });
</script>

<style scoped>
  .clock-interface {
    width: 250px;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .clock-face {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    position: relative;
    background-color: #f0f0f0;
  }

  .clock-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #1976d2;
    transform: translate(-50%, -50%);
  }

  .clock-hand {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 90px;
    background-color: #1976d2;
    transform-origin: bottom center;
    transition: transform 0.1s;
  }

  .clock-number {
    position: absolute;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }

  .time-display {
    margin-top: 20px;
    font-size: 24px;
    font-weight: bold;
  }
</style>
