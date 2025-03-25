<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import type { SidebarProps } from '@/components/ui/sidebar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { botStore } from "~/store/botStore"; // Import Pinia store

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const slideBarStore = botStore();

// Add keyboard shortcut for Ctrl+B
const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === 'b') {
    event.preventDefault();
    slideBarStore.siderBarslider = !slideBarStore.siderBarslider;
  }
};

// Function to toggle sidebar
const toggleSidebar = () => {
  slideBarStore.siderBarslider = !slideBarStore.siderBarslider;
};

// Add event listener when component mounts
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  
  // Add click event to the sidebar rail
  const sidebarRail = document.querySelector('.sidebar-rail');
  if (sidebarRail) {
    sidebarRail.addEventListener('click', toggleSidebar);
  }
});

// Remove event listener when component unmounts
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  
  // Remove click event from the sidebar rail
  const sidebarRail = document.querySelector('.sidebar-rail');
  if (sidebarRail) {
    sidebarRail.removeEventListener('click', toggleSidebar);
  }
});
</script>
<template>
  <Sidebar
     v-bind="props"
     class="bg-[#fafafa]"
    :collapsed="!slideBarStore.siderBarslider"
  >
    <SidebarHeader class="bg-[#fafafa] pt-3 pl-3">
      <NuxtLink to="/" class="flex w-full">
        <img v-show="!slideBarStore.siderBarslider" src="assets/icons/Tring-AI-update-Logo.png" width="40" height="40" />
        <img v-show="slideBarStore.siderBarslider" src="assets/icons/Tring-Ai-Logo-with-black-text.png" width="160"
          height="160" />
      </NuxtLink>
    </SidebarHeader>
    <SidebarContent class="bg-[#fafafa]">
      <NavMain />
    </SidebarContent>
    <SidebarFooter class="bg-[#fafafa]">
      <NavUser />
    </SidebarFooter>
    <SidebarRail class="sidebar-rail cursor-col-resize" />
  </Sidebar>
</template>

<style scoped>
.cursor-col-resize {
  cursor: col-resize;
}
</style>