<template>
  <div v-if="!(route.path === '/auth/onboarding/billing')">
    <MenuIcon :size="32" @click="isSheetOpen = !isSheetOpen" />
  </div>
  <!-- </UiButton> -->
  <UiSheet v-model:open="isSheetOpen">
    <UiSheetContent side="left" class="px-0 flex items-center self-center w-[250px]">
      <div
        class="border-r border-[#8a8a8a1a] flex-col items-center justify-center gap-[20px] h-[100vh] overflow-y-scroll w-full overflow-x-hidden">
        <NavigationDrawer @closeSheet="closeSheet" />
      </div>
    </UiSheetContent>
  </UiSheet>
</template>
<script setup lang="ts">
import { MenuIcon } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";

const isSheetOpen = ref(false)
const route = useRoute();

const closeSheet = () => {
  isSheetOpen.value = false;
};
</script>