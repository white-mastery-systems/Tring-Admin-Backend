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
Copy
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

// defineProps<{
//   items: {
//     title: string
//     url: string
//     icon?: LucideIcon
//     isActive?: boolean
//     items?: {
//       title: string
//       url: string
//     }[]
//   }[]
// }>()
const { navigationModules, dropdownMenuItems } = useNavigationAndAccordion()
</script>
<template>
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarMenu>
      <Collapsible v-for="item in navigationModules" :key="item.name" as-child :default-open="item.isActive"
        class="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger as-child>
            <SidebarMenuButton :tooltip="item.name">
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
                  <NuxtLink :to="item.path + subItem.path" class="flex items-center space-x-2">
                    <span>{{ subItem.name }}</span>
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