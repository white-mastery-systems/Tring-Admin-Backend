<!-- <script setup lang="ts">
// import {
//   Collapsible,
//   UiCollapsibleContent,
//   UiCollapsibleTrigger,
// } from '@/registry/new-york/ui/collapsible'
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
defineProps<{
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}>()
</script>
<template>
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarMenu>
      <UiCollapsible v-for="item in items" :key="item.title" as-child :default-open="item.isActive"
        class="group/collapsible">
        <SidebarMenuItem>
          <UiCollapsibleTrigger as-child>
            <SidebarMenuButton :tooltip="item.title">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
              <ChevronRight
                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </UiCollapsibleTrigger>
          <UiCollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                <SidebarMenuSubButton as-child>
                  <a :href="subItem.url">
                    <span>{{ subItem.title }}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </UiCollapsibleContent>
        </SidebarMenuItem>
      </UiCollapsible>
    </SidebarMenu>
  </SidebarGroup>
</template> -->
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
// Computed property to check if an item is active (including children)
// const activeItems = computed(() => {
//   const activeMap:any = {};
//   navigationModules.value?.forEach((item) => {
//     activeMap[item.name] = route.path === item.path || item.children.some(subItem => route.path === item.path + subItem.path);
//   });
//   return activeMap;
// });

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
                  <component :is="item.icon" :stroke-width="1.5" :size="18"></component>
                  <span v-if="(isMobile) ? isMobile : (slideBarStore.siderBarslider)">{{ item.name }}</span>
                </NuxtLink>
              </template>
              <template v-else>
                <NuxtLink :to="item.path" class="flex items-center space-x-2"
                  :class="(!slideBarStore.siderBarslider) ? '' : 'w-full'" @click="mobileSidebarControl(item)">
                  <NavWhatsappIcon v-if="item.name === 'Whatsapp Bot'" :class="(!slideBarStore.siderBarslider) ? 'w-[22px] h-[22px]' : 'w-[18px] h-[18px]'"></NavWhatsappIcon>
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