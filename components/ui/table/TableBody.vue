<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <tbody :class="cn('max-h-[50vh] [&_tr:last-child]:border-0', props.class)">
    <slot></slot>
  </tbody>
</template>
