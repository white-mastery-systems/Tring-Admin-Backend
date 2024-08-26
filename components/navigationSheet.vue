<template>
  <!-- <UiButton @click="isSheetOpen = !isSheetOpen" class="z-40"> -->
  <div class="absolute top-0 left-0 mb-4 bg-white w-full px-2 py-1">
    <MenuIcon :size="32" @click="isSheetOpen = !isSheetOpen" />
  </div>
  <!-- </UiButton> -->
  <UiSheet v-model:open="isSheetOpen">
    <UiSheetContent side="left" class="px-0 flex items-center self-center w-[250px]">
      <div class="border-r border-[#8a8a8a1a] flex-col items-center justify-center gap-[20px] w-full">
        <NavigationDrawer @closeSheet="closeSheet" />
      </div>
    </UiSheetContent>
  </UiSheet>
</template>
<script setup lang="ts">
import { MenuIcon } from "lucide-vue-next";
const isSheetOpen = ref(false)

const closeSheet = () => {
  console.log('inidesdadsa')
  isSheetOpen.value = false;
};
</script>