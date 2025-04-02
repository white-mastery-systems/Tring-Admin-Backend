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
import { Zap, MessageSquare, Phone } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})
const { session, error, loading, getSession } = useAuth()
const { user, clearUser } = await useUser();
// const trialContent = ref([])
const slideBarStore = botStore();
const trialContent = ref([]); // Initialize as empty array


// Add event listener when component mounts
onMounted(async() => {
  try {
    await handleNavigation()
    trialContent.value = await userPlan();
  } catch (error) {
    toast.error(error.statusMessage);
  }
  window.addEventListener('keydown', handleKeyDown);
  // Add click event to the sidebar rail
  const sidebarRail = document.querySelector('.sidebar-rail');
  if (sidebarRail) {
    sidebarRail.addEventListener('click', toggleSidebar);
  }
});


// Fetch the user plan data when component is mounted
// Add keyboard shortcut for Ctrl+B
const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === 'b') {
    event.preventDefault();
    slideBarStore.siderBarslider = !slideBarStore.siderBarslider;
  }
};
const hasTrial = computed(() => {
  return trialContent.value.userPlanDetails.some((sub) => sub.subscriptionStatus === 'trial');
});

const handleNavigation = async () => {
  try {
    await getSession()

    if (!session.value.status) {
      clearUser()
      console.log("Session status:", session.value.status)
      await navigateTo("/auth/sign-in")
      return
    }
  } catch (error) {
    console.error('Session check error:', error)
    clearUser()
    await navigateTo("/auth/sign-in")
  }
}
// Function to toggle sidebar
const toggleSidebar = () => {
  slideBarStore.siderBarslider = !slideBarStore.siderBarslider;
};
// Remove event listener when component unmounts
onUnmounted(async() => {
  window.removeEventListener('keydown', handleKeyDown);
  
  // Remove click event from the sidebar rail
  const sidebarRail = document.querySelector('.sidebar-rail');
  if (sidebarRail) {
    sidebarRail.removeEventListener('click', toggleSidebar);
  }
});
</script>
<template>
  <Sidebar v-bind="props" class="bg-[#fafafa]" :collapsed="!slideBarStore.siderBarslider">
    <SidebarHeader class="bg-[#fafafa] pt-3 pl-3">
      <NuxtLink to="/" class="flex w-full">
        <img v-show="!slideBarStore.siderBarslider" src="assets/icons/Tring-AI-update-Logo.png" width="40"
          height="40" />
        <img v-show="slideBarStore.siderBarslider" src="assets/icons/Tring-Ai-Logo-with-black-text.png" width="160"
          height="160" />
      </NuxtLink>
    </SidebarHeader>
    <SidebarContent class="bg-[#fafafa]">
      <NavMain />
    </SidebarContent>
    <SidebarFooter class="bg-[#fafafa] gap-6">
      <UiCard v-if="hasTrial" class="w-full border border-[#FFBC42] border-[1px] h-[160px] bg-[#FFF8EB] rounded-lg p-3">
        <div class="mb-1">
          <UiButton
            class="flex gap-2 bg-[#E3E4F8] hover:bg-[#E3E4F8] text-[#424BD1] px-4 py-0 rounded-full text-[10px] h-[20px] font-regular">
            <Zap class="w-3 h-3" :stroke-width="1.5" />
            <span>
              free trial
            </span>
          </UiButton>
        </div>
        <div class="flex justify-between items-center w-full gap-2 px-0 h-[90%]">
           <template v-for="trial in trialContent.userPlanDetails" :key="trial.type">
            <div v-if="trial.subscriptionStatus === 'trial'"
              class="bg-[#FFFFFF] w-full rounded-lg p-2 flex flex-col items-center justify-center h-[85%]">
              <component :is="(trial.type === 'chat') ? MessageSquare : Phone" :stroke-width="1.5" :size="20" class="text-[#FFBC42] mb-3"></component>
                <div class="text-[12px] font-medium text-gray-800 mb-1 capitalize">{{ trial.type }}bot</div>
              <div class="flex text-[8px] text-gray-500 w-full">
                <span class="flex justify-center w-full">{{ (trial.type === 'chat') ? 'Remaining Days' : 'Time available'
                  }}<span class="text-[#424BD1] font-medium pl-1">{{ trial.maxQuota }} {{ (trial.type === 'chat') ? '' :
                    'mins'}}</span></span>
              </div>
            </div>
          </template>
        </div>
      </UiCard>
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