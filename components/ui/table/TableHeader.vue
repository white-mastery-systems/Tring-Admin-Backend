<script setup lang="ts">
  import type { HTMLAttributes } from "vue";

  const props = defineProps<{
    class?: HTMLAttributes["class"];
  }>();
</script>

<template>
  <thead :class="cn('[&_tr]:border-b', props.class)">
    <slot></slot>
  </thead>
</template>
