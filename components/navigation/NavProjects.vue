<script setup lang="ts">
// import {
//   UiDropdownMenu,
//   UiDropdownMenuContent,
//   UiDropdownMenuItem,
//   UiDropdownMenuSeparator,
//   UiDropdownMenuTrigger,
// } from '@/registry/new-york/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Folder,
  Forward,
  type LucideIcon,
  MoreHorizontal,
  Trash2,
} from 'lucide-vue-next'
defineProps<{
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}>()
const { isMobile } = useSidebar()
</script>
<template>
  <SidebarGroup class="group-data-[collapsible=icon]:hidden">
    <SidebarGroupLabel>Projects</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in projects" :key="item.name">
        <SidebarMenuButton as-child>
          <a :href="item.url">
            <component :is="item.icon" />
            <span>{{ item.name }}</span>
          </a>
        </SidebarMenuButton>
        <UiDropdownMenu>
          <UiDropdownMenuTrigger as-child>
            <SidebarMenuAction show-on-hover>
              <MoreHorizontal />
              <span class="sr-only">More</span>
            </SidebarMenuAction>
          </UiDropdownMenuTrigger>
          <UiDropdownMenuContent class="w-48 rounded-lg" :side="isMobile ? 'bottom' : 'right'"
            :align="isMobile ? 'end' : 'start'">
            <UiDropdownMenuItem>
              <Folder class="text-muted-foreground" />
              <span>View Project</span>
            </UiDropdownMenuItem>
            <UiDropdownMenuItem>
              <Forward class="text-muted-foreground" />
              <span>Share Project</span>
            </UiDropdownMenuItem>
            <UiDropdownMenuSeparator />
            <UiDropdownMenuItem>
              <Trash2 class="text-muted-foreground" />
              <span>Delete Project</span>
            </UiDropdownMenuItem>
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton class="text-sidebar-foreground/70">
          <MoreHorizontal class="text-sidebar-foreground/70" />
          <span>More</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
