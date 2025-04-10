<script setup lang="ts">
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Separator
} from '@/components/ui/separator'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-vue-next'
import { useNavigationAndAccordion } from '~/composables/navigation/useNavigationAndAccordion';
import { useRouter, useRoute } from "vue-router";
import { useSubscriptionCheck } from '~/composables/billing/useSubscriptionCheck';
import { useOrgDetailsStore } from "~/store/orgDetailsStore";
import { useUser } from '~/composables/auth'
import { useAuth } from '~/composables/useAuth'

const { navigationModules, dropdownMenuItems } = useNavigationAndAccordion()
const { isAnyPlanFree, subcribed, checkSubscription } = useSubscriptionCheck()
const logoutModal = ref(false);
const OrgDetails = useOrgDetailsStore();
const { user, clearUser } = await useUser();
const { session, error, loading, getSession } = useAuth()

const userInfo = computed(() => {
  return user.value;
});

const avatarValue = ref(OrgDetails.values?.logo || userInfo.value?.profile_image)

// const props = defineProps<{
//   user: {
//     name: string
//     email: string
//     avatar: string
//   }
// }>()
const route = useRoute();
const router = useRouter();
const { isMobile, toggleSidebar } = useSidebar()

const handleLogout = async () => {
  localStorage.clear();
  authHandlers.logout();
  logoutModal.value = false;
  navigateTo({ name: "auth-sign-in" });
};
const navigateToSamePage = (path: any) => {
  if (route.path === path.path) {
    // If already on the same page, update the query
    router.replace(path);
  }
  if ((path.path === '/billing/view-wallet') && !subcribed.value) {
    toast.error("Please upgrade your plan to access this feature")
  }
    if (isMobile.value) {
    toggleSidebar();
    // slideBarStore.siderBarslider = false
  }
};

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
const mobileSidebarControl = () => {
  // console.log(isMobile.value, "isMobile.value -- isMobile.value")
  if (isMobile.value) {
    toggleSidebar();
    // slideBarStore.siderBarslider = false
  }
}
</script>
<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="avatarValue" :alt="userInfo?.username" />
              <AvatarFallback class="rounded-lg">
                {{ userInfo?.username?.toUpperCase()?.charAt(0) }}
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ userInfo?.username }}</span>
              <span class="truncate text-xs">{{ userInfo?.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg px-0 text-[#334155] left-5"
          :side="isMobile ? 'bottom' : 'right'" align="end" :side-offset="8" :align-offset="-2">
          <DropdownMenuLabel class="font-medium text-[16px] pl-[16.5px] pr-0 py-1">
            <span>My Account</span>
            <!-- <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="avatarValue" :alt="userInfo?.username" />
                <AvatarFallback class="rounded-lg">
                  {{ userInfo?.username?.toUpperCase()?.charAt(0) }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ userInfo?.username }}</span>
                <span class="truncate text-xs">{{ userInfo?.email }}</span>
              </div>
            </div> -->
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup class="font-medium text-[16px] p-0">
            <DropdownMenuItem v-for="item in dropdownMenuItems" :key="item.path" class="pr-0 py-0 pl-4"
              @click.prevent="navigateToSamePage(item.path)">
              <!-- @click.prevent="navigateToSamePage(item.path)" -->
              <NuxtLink
                :to="(!subcribed && (item.path.path === '/billing/view-wallet')) ? '/billing/view-all' : item.path"
                class="flex items-center w-full min-h-[40px]" @click="handleNavigation">
                <DropdownMenuShortcut class="flex items-center gap-2 w-full">
                  <component :is="item.icon" size="18"></component>
                  {{ item.label }}
                </DropdownMenuShortcut>
              </NuxtLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <!-- <Separator /> -->
          <DropdownMenuSeparator />
          <DropdownMenuItem class="flex items-center w-full py-[10px] cursor-pointer pl-[15px]" @click="handleLogout">
            <div class="flex items-center font-medium w-full gap-[8px]">
              <Icon name="ic:round-logout" class="h-[18px] w-[18px]" />
              <p class="text-sm font-medium">Logout</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
        <DropdownMenuSeparator />
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
