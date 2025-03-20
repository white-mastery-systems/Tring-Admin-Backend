<!-- <script setup lang="ts">
import { Calendar, Home, Inbox, Search, Settings, House } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { useNavigationAndAccordion } from '~/composables/navigation/useNavigationAndAccordion';
import { useSubscriptionCheck } from '~/composables/billing/useSubscriptionCheck';
import { useRoute, useRouter } from "vue-router";
import { HomeIcon, UserIcon, SettingsIcon } from "lucide-vue-next";
// Menu items.
const user = ref({
  name: 'shadcn',
  email: 'm@example.com',
  avatar: '/avatars/shadcn.jpg',
})
const { isAnyPlanFree, subcribed, checkSubscription } = useSubscriptionCheck()
const { navigationModules, dropdownMenuItems } = useNavigationAndAccordion()
// const navigationModules = ref([
//   {
//     name: "Home",
//     icon: HomeIcon,
//     path: "/",
//     children: [],
//   },
//   {
//     name: "Analytics",
//     icon: HomeIcon,
//     path: "/analytics",
//     children: [
//       { name: "Leads", path: "/leads" },
//       { name: "Chats", path: "/chats" },
//       { name: "Call Logs", path: "/call-logs" },
//     ],
//   },
//   {
//     name: "Contacts",
//     icon: UserIcon,
//     path: "/contacts",
//     children: [
//       { name: "Contacts", path: "/contacts-list" },
//       { name: "Buckets", path: "/buckets" },
//       { name: "Campaigns", path: "/campaigns" },
//     ],
//   },
//   {
//     name: "Settings",
//     icon: SettingsIcon,
//     path: "/settings",
//     children: [
//       { name: "Integrations", path: "/integration" },
//       { name: "Whatsapp Template", path: "/whatsapp-template" },
//     ],
//   },
// ]);
const route = useRoute();
const router = useRouter();

const navigateToSamePage = (path: any) => {
  if (route.path === path.path) {
    // If already on the same page, update the query
    router.replace(path);
  }
  if ((path.path === '/billing/view-wallet') && !subcribed.value) {
    toast.error("Please upgrade your plan to access this feature")
  }
};
</script>
<template>
  <Sidebar class="bg-[#fafafa]">
    <SidebarContent class="bg-[#fafafa]">
      <SidebarGroup>
        <div class="pt-3 py-6 flex justify-center">
          <img class="self-center" src="assets/icons/Tring-Ai-Logo-with-black-text.png" width="160" height="160" />
        </div>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          <Collapsible v-for="item in navigationModules" :key="item.name" :defaultOpen="false" class="group/collapsible"
            collapsible="icon">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton class="flex justify-between w-full">
                  <div class="flex items-center space-x-2">
                    <template v-if="item.children.length">
                      <WhatsappIcon v-if="item.path === '/whatsapp-bot'"></WhatsappIcon>
                      <component v-if="item.icon" :is="item.icon" size="18" />
                      <span>{{ item.name }}</span>
                    </template>
                    <template v-else>
                      <NuxtLink :to="item.path" class="flex items-center space-x-2">
                        <WhatsappIcon v-if="item.path === '/whatsapp-bot'"></WhatsappIcon>
                        <component v-if="item.icon" :is="item.icon" size="18" />
                        <span>{{ item.name }}</span>
                      </NuxtLink>
                    </template>
                  </div>
                  <ChevronDownIcon class="transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  <SidebarMenuAction class="peer-data-[active=true]/menu-button:opacity-100" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent v-if="item.children.length">
                <SidebarMenuSub>
                  <SidebarMenuSubItem v-for="subItem in item.children" :key="subItem.path">
                    <NuxtLink :to="item.path + subItem.path" class="flex items-center space-x-2">
                      <span>{{ subItem.name }}</span>
                    </NuxtLink>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter class="bg-[#fafafa]">
      <NavUser />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template> -->

<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'
// import NavMain from '@/registry/new-york/block/Sidebar07/components/NavMain.vue'
// import NavProjects from '@/registry/new-york/block/Sidebar07/components/NavProjects.vue'
// import NavUser from '@/registry/new-york/block/Sidebar07/components/NavUser.vue'
// import TeamSwitcher from '@/registry/new-york/block/Sidebar07/components/TeamSwitcher.vue'
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
</script>
<template>
  <Sidebar v-bind="props" class="bg-[#fafafa]">
    <SidebarHeader class="bg-[#fafafa] pt-3 pl-3">
      <NuxtLink to="/" class="flex w-full">
        <!-- <div class="pt-3 py-6 flex justify-center"> -->
        <img v-show="!slideBarStore.siderBarslider" src="assets/icons/Tring-AI-update-Logo.png" width="40" height="40" />
        <img v-show="slideBarStore.siderBarslider" src="assets/icons/Tring-Ai-Logo-with-black-text.png" width="160"
          height="160" />
      </NuxtLink>
      <!-- {{ slideBarStore.siderBarslider }} || asdsad -->
      <!-- </div> -->
      <!-- <TeamSwitcher :teams="data.teams" /> -->
    </SidebarHeader>
    <SidebarContent class="bg-[#fafafa]">
      <NavMain />
    </SidebarContent>
    <SidebarFooter class="bg-[#fafafa]">
      <NavUser />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
