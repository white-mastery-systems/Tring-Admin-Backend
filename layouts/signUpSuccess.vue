<!-- layouts\auth.vue -->
<template>
  <div class="flex p-[25px] justify-center h-[100vh] w-full overflow-hidden">
    <div class="flex flex-col justify-center items-center w-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const paramId: any = route
</script>

<style scoped></style>
