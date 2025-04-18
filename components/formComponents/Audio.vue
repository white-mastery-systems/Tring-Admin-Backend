<template>
  <div class="mt-4">
    <audio ref="audio" :src="audioSrc" @loadedmetadata="setDuration" />
    <div class="controls mt-2">
      <button @click="playAudio" :disabled="isPlaying">Play</button>
      <button @click="pauseAudio" :disabled="!isPlaying">Pause</button>
      <button @click="stopAudio">Stop</button>
    </div>
    <p class="mt-2">
      {{ formattedCurrentTime }} / {{ formattedDuration }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useField } from 'vee-validate';

const props = withDefaults(
  defineProps<{
    name: string;
    accept?: string;
    validation?: boolean;
  }>(),
  {
    accept: 'audio/*',
    validation: true,
  }
);

const audioSrc = ref('');
const currentTime = ref(0);
const duration = ref(0);
const isPlaying = ref(false);

const { value, errorMessage }: { value: any; errorMessage: any } =
  props.validation ? useField(() => props.name) : { value: '', errorMessage: '' };

const playAudio = () => {
  const audioElement = $refs.audio as HTMLAudioElement;
  audioElement.play();
  isPlaying.value = true;
};

const pauseAudio = () => {
  const audioElement = $refs.audio as HTMLAudioElement;
  audioElement.pause();
  isPlaying.value = false;
};

const stopAudio = () => {
  const audioElement = $refs.audio as HTMLAudioElement;
  audioElement.pause();
  audioElement.currentTime = 0;
  isPlaying.value = false;
  currentTime.value = 0;
};

// Format time for display
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

// Set duration when audio metadata is loaded
const setDuration = () => {
  const audioElement = $refs.audio as HTMLAudioElement;
  duration.value = audioElement.duration;
};

// Watch for current time updates
watch(
  () => currentTime.value,
  (newValue) => {
    const audioElement = $refs.audio as HTMLAudioElement;
    audioElement.currentTime = newValue;
  }
);

// Computed properties for display
const formattedCurrentTime = computed(() => formatTime(currentTime.value));
const formattedDuration = computed(() => formatTime(duration.value));
</script>

<style scoped>
.controls {
  display: flex;
  gap: 10px;
}
</style>
