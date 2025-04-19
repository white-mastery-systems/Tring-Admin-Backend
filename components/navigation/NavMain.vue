<script setup lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { ChevronRight, type LucideIcon } from 'lucide-vue-next'
import { useRouter, useRoute } from "vue-router";
import { SIDEBAR_WIDTH_MOBILE, useSidebar } from '@/components/ui/sidebar/utils'
import { botStore } from "~/store/botStore"; // Import Pinia store
import { useAuth } from '~/composables/useAuth'
import { useUser } from '~/composables/auth'
import { NavWhatsappIcon } from '#components';

useHead({
  link: [
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:wght@100..700" }
  ]
})

const router = useRouter();
const route = useRoute();
const { navigationModules, dropdownMenuItems } = useNavigationAndAccordion()
const { isMobile,toggleSidebar } = useSidebar()
const slideBarStore = botStore();
const { session, error, loading, getSession } = useAuth()
const { user, clearUser } = await useUser();
// Computed property to determine if the collapsible should be open
const activeRoutes = computed(() => {
  const activeMap:any = {};
  navigationModules.value?.forEach((item) => {
    activeMap[item.name] = route.path === item.path || item.children.some(subItem => route.path === item.path + subItem.path);
  });
  return activeMap;
});
const activeItems = computed(() => {
  const activeMap: any = {};

  navigationModules.value?.forEach((item) => {
    const regex = new RegExp(`^${item.path}(/.*)?$`); // Matches `/chat-bot` and `/chat-bot/*`
    activeMap[item.name] = regex.test(route.path);
  });

  return activeMap;
});

const handleNavigation = async (sliderHandling:any) => {
  if (sliderHandling === 'children') {
    if (!slideBarStore.siderBarslider) {
      toggleSidebar()
      slideBarStore.siderBarslider = true
    }
  }
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

const mobileSidebarControl = async (value: any) => {
  try {
    await handleNavigation('parent')

    if (isMobile.value) {
      toggleSidebar()
    }
  } catch (error) {
    console.error('Sidebar control error:', error)
  }
}
</script>
<template>
  <SidebarGroup>
    <SidebarMenu>
      <UiCollapsible v-for="item in navigationModules" :key="item.name" as-child :default-open="activeRoutes[item.name]"
        class="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger as-child>
            <SidebarMenuButton :tooltip="item.name"
              :class="[activeItems[item.name] ? 'bg-[#FFF8EB] text-[#3D3D3D]' : '']">
              <template v-if="item.children.length">
                <NuxtLink :to="item.path + item.children[0].path" class="flex items-center gap-2"
                  :class="(!slideBarStore.siderBarslider) ? '' : 'w-full'" @click="handleNavigation('children')">
                  <NavWhatsappIcon v-if="item.name === 'Whatsapp'" :class="(!slideBarStore.siderBarslider && !isMobile) ? 'w-[18px] h-[18px]' : 'w-[18px] h-[18px]'"></NavWhatsappIcon>
                  <component :is="item.icon" :stroke-width="1.5" :size="18"></component>
                  <span v-if="(isMobile) ? isMobile : (slideBarStore.siderBarslider)">{{ item.name }}</span>
                </NuxtLink>
              </template>
              <template v-else>
                <NuxtLink :to="item.path" class="flex items-center space-x-2"
                  :class="(!slideBarStore.siderBarslider) ? '' : 'w-full'" @click="mobileSidebarControl(item)">
                  <component :is="item.icon" :stroke-width="1.5" :size="18"></component>
                  <span>{{ item.name }}</span>
                </NuxtLink>
              </template>
              <ChevronRight v-if="item.children.length"
                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent v-if="item.children.length">
            <SidebarMenuSub>
              <SidebarMenuSubItem v-for="subItem in item.children" :key="subItem.name">
                <SidebarMenuSubButton as-child>
                  <NuxtLink @click="mobileSidebarControl(item)" :to="item.path + subItem.path"
                    class="flex items-center space-x-2 hover:bg-[#f4f4f5] text-gray-500">
                    <span :class="(route.path.includes(item.path + subItem.path)) ? 'text-[#3D3D3D]' : ''">{{
                      subItem.name }}</span>
                  </NuxtLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </UiCollapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>