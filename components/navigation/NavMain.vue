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

const router = useRouter();
const route = useRoute();
const { navigationModules, dropdownMenuItems } = useNavigationAndAccordion()
const { isMobile,toggleSidebar } = useSidebar()

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

const mobileSidebarControl = (value: any) => {

  if (isMobile.value) {
    toggleSidebar();
  }
  // if (!value.children.length && isMobile.value) {
  //   toggleSidebar()
  // } if (value.children.length && isMobile.value) {
  //   toggleSidebar()
  // }
}
</script>
<template>
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarMenu>
      <Collapsible v-for="item in navigationModules" :key="item.name" as-child :default-open="activeRoutes[item.name]"
        class="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger as-child>
            <SidebarMenuButton :tooltip="item.name" :class="[activeItems[item.name] ? 'bg-[#0F172A] text-white' : '']">
              <template v-if="item.children.length">
                <WhatsappIcon v-if="item.path === '/whatsapp-bot'"></WhatsappIcon>
                <!-- <span class="material-symbols-rounded">
                  home
                </span> -->
                <component v-if="item.icon" :is="item.icon" size="18" />
                <span>{{ item.name }}</span>
              </template>
              <template v-else>
                <NuxtLink :to="item.path" class="flex items-center space-x-2" @click="mobileSidebarControl(item)">
                  <WhatsappIcon v-if=" item.path==='/whatsapp-bot'"></WhatsappIcon>
                  <component v-if=" item.icon" :is="item.icon" size="18" />
                  <span>{{ item.name }}</span>
                </NuxtLink>
              </template>
              <!-- <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.name }}</span> -->
              <ChevronRight v-if="item.children.length"
                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem v-for="subItem in item.children" :key="subItem.name">
                <SidebarMenuSubButton as-child>
                  <NuxtLink @click="mobileSidebarControl(item)" :to="item.path + subItem.path"
                    class="flex items-center space-x-2">
                    <span :class="(route.path.includes(item.path + subItem.path)) ? 'text-gray-500' : ''">{{
                      subItem.name }}</span>
                  </NuxtLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>