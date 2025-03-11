<template>
  <Transition name="fade">
    <div v-if="loading"
      class="fixed inset-y-0 right-0 w-[83%] flex items-center justify-center bg-black bg-opacity-0 z-50">
      <div class="text-[#424BD1]">
        <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  loading: Boolean
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
