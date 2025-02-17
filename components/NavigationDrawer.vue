<template>
  <div class="flex h-[100vh] w-[250px] flex-col items-center gap-5 overflow-y-scroll bg-[#ffffff] relative">
    <!-- style="box-shadow: 0px 0px 24px 0px #00000000 !important;" -->
    <NuxtLink to="/" class="flex w-full justify-center">
      <img class="self-center pt-[50px] sm:pt-[50px] md:pt-[50px] lg:pt-[26px] xl:pt-[26px]"
        src="assets\icons\Tring-Ai-Logo-with-black-text.png" width="190" height="190" />
    </NuxtLink>
    <div
      class="flex w-full flex-col items-center gap-4 overflow-scroll pb-[5px] pt-3 min-h-[64%] sm:min-h-[64%] md:min-h-[69%] max-h-[64%] sm:max-h-[64%] md:max-h-[69%]">
      <template v-for="{ name, icon, path, children } in navigationModules" :key="path">
        <!-- {{ openAccordions }}  - sdfdsf
      {{ path}} -->
        <UiAccordion v-if="children?.length > 0" type="single" class="w-[90%]" v-model="openAccordions.path"
          collapsible>
          <UiAccordionItem :value="path" class="shadow-md border-0 bg-white">
            <div class="field_shadow flex cursor-pointer items-center gap-3 px-[16px] font-medium" :class="[
              route.path?.includes(path) ? 'bg-[#424bd1] text-[#ffffff]' : '',
              openAccordions.path === path
                ? 'rounded-t-[10px]'
                : 'rounded-[10px]',
            ]">
              <component :is="icon"></component>
              <UiAccordionTrigger class="w-full no-underline hover:no-underline py-[10px]">
                {{ name }}</UiAccordionTrigger>
            </div>
            <div class="rounded-b-lg">
              <UiAccordionContent v-for="(item, index) in children" :key="item.path"
                class="text-md border border-none bg-[#F0F6FF] py-4 pl-12 font-bold" :class="[
                  route.path?.includes(path + item.path) && 'text-[#424bd1]',
                  index === children.length - 1 ? 'rounded-b-lg' : '',
                ]" @click="handleNavigation">
                <NuxtLink :to="path + item.path">
                  {{ item.name }}
                </NuxtLink>
              </UiAccordionContent>
            </div>
          </UiAccordionItem>
        </UiAccordion>
        <NuxtLink v-else-if="!!(path !== '/')" :to="path" @click="handleNavigation"
          class="field_shadow flex w-[90%] cursor-pointer items-center gap-3 rounded-[10px] px-[18px] py-[10px] font-medium"
          :class="[
            route.path?.includes(path)
              ? 'bg-[#424bd1] text-[#ffffff]'
              : 'bg-[#ffffff]',
          ]">
          <WhatsappIcon v-if="path === '/whatsapp-bot'"></WhatsappIcon>
          <component :is="icon"></component>

          <span class="text-[16px]">{{ name }}</span>
        </NuxtLink>
        <NuxtLink v-else :to="path" @click="handleNavigation"
          class="field_shadow flex w-[90%] cursor-pointer items-center gap-3 rounded-[10px] px-[18px] py-[10px] font-medium"
          :class="[
            route.path === path
              ? 'bg-[#424bd1] text-[#ffffff]'
              : 'bg-[#ffffff]',
          ]">
          <component :is="icon"></component>
          <span class="text-[16px]">{{ name }}</span>
        </NuxtLink>
      </template>
      <!-- <div class="absolute bottom-0 w-full"> -->
      <!-- </div> -->
    </div>
    <UiDropdownMenu class="mb-5 sticky bottom-0 left-0" ref="dropdownMenu">
      <UiDropdownMenuTrigger asChild>
        <Button variant="outline" class="relative w-[90%] rounded-xl border-[1px] border-[var(border)] px-2 py-1"
          @click="handleDropdownChange">
          <div class="flex items-center gap-2 w-full">
            <UiAvatar>
              <UiAvatarImage class="capitalize" :src="avatarValue" :alt="userInfo?.username" />
              <UiAvatarFallback>{{ userInfo?.username?.toUpperCase()?.charAt(0) }}</UiAvatarFallback>
            </UiAvatar>
            <div class="flex items-center">
              <div class="flex flex-col">
                <span class="min-w-[135px] max-w-[135px] truncate font-bold capitalize text-left">{{ userInfo?.username
                  }}</span>
                <span class="min-w-[135px] max-w-[135px] truncate">{{ userInfo?.email }}</span>
              </div>
              <div>
                <ChevronRight
                  :class="['w-[16px] h-[16px] transform transition-transform duration-100 ease-in-out', (isDropdownOpen) ? 'rotate-0' : 'rotate-90']" />
              </div>
            </div>
          </div>
          <div v-if="isAnyPlanFree" @click.stop
            class="flex flex-col justify-center items-center gap-4 absolute bottom-[-35px] left-[0px] rounded-lg bg-[#424bd1] field_shadow payment-popup">
            <!-- <div class="min-h-[40px] min-w-[40px] max-w-[40px] bg-[#424bd1] rounded-full">
    
              </div> -->
            <div class="text-[#FFFFFF] text-sm font-normal py-2 px-0 rounded-lg">You’re on the<span
                class="font-medium text-[16px]"> Free Plan! </span>
              Unlock the full potential of <span class="font-medium text-[16px]"> Tring AI, upgrade</span> and
              <span class="font-medium text-[16px]"> access exclusive features </span> right now!
            </div>
            <UiButton @click.prevent.stop="redirectToBilling"
              class="flex justify-center gap-3 text-[14px] bg-[#FFFFFF] font-bold text-[424bd1] rounded-lg hover:bg-[#FFFFFF] hover:brightness-90 w-[90%] text-[#424bd1]">
              <img src="assets\icons\freeTrailUpgrade.svg"></img>
              <!-- <component :is="LucideArrowUpRight" class="text-[12px]"></component> -->
              Upgrade
            </UiButton>
          </div>
        </Button>
      </UiDropdownMenuTrigger>
      <UiDropdownMenuContent class="min-w-52 mb-[10px] ml-[9px]" :side="(isMobile) ? 'top' : 'right'">
        <!-- <UiDropdownMenuLabel>My Account</UiDropdownMenuLabel>
          <UiDropdownMenuSeparator /> -->
        <UiDropdownMenuGroup class="font-medium text-[16px] pl-2 pr-0 py-1">
          <UiDropdownMenuItem v-for="item in dropdownMenuItems" :key="item.path" class="pr-0 py-0"
            @click.prevent="navigateToSamePage(item.path)">
            <NuxtLink
              :to="(!subcribed && (item.path.path === '/billing/view-wallet')) ? '/billing/view-all' : item.path"
              @click.prevent="navigateToSamePage(item.path)" class="flex items-center w-full min-h-[40px]">
              <DropdownMenuShortcut class="flex items-center gap-2 w-full">
                <component :is="item.icon" size="18"></component>
                {{ item.label }}
              </DropdownMenuShortcut>
            </NuxtLink>
          </UiDropdownMenuItem>
          <UiDropdownMenuItem class="flex items-center w-full py-[10px]">
            <div @click="handleLogout" class="flex items-center font-medium w-full gap-[8px] text-[#ef4444]">
              <Icon name="ic:round-logout" class="h-[18px] w-[18px]" />
              <p class="text-sm font-medium">Logout</p>
            </div>
          </UiDropdownMenuItem>
        </UiDropdownMenuGroup>
      </UiDropdownMenuContent>
    </UiDropdownMenu>

    <!-- </div> -->
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useOrgDetailsStore } from "~/store/orgDetailsStore";
import { useSubscriptionCheck } from '~/composables/billing/useSubscriptionCheck';
import { useNavigationAndAccordion } from '~/composables/navigation/useNavigationAndAccordion';
import { useScreenSize } from '~/composables/navigation/useScreenSize'
import { ChevronRight } from 'lucide-vue-next';
import { useAuth } from '~/composables/useAuth'
import { useUser } from '~/composables/auth'

const { isAnyPlanFree, subcribed, checkSubscription } = useSubscriptionCheck()
const { navigationModules, dropdownMenuItems } = useNavigationAndAccordion()
const { isMobile } = useScreenSize()
const isDropdownOpen = ref(false);
const dropdownMenu = ref(null);
const { session, error, loading, getSession } = useAuth()
const router = useRouter();

const { user, clearUser } = await useUser();
const userInfo = computed(() => {
  return user.value;
});
const logoutModal = ref(false);
const route = useRoute();
const emit = defineEmits(["closeSheet"]);
const openAccordions: any = ref({
  path: route.path.split("/").slice(0, 2).join("/"),
});
const OrgDetails = useOrgDetailsStore();
const avatarValue = ref(OrgDetails.values?.logo || userInfo.value?.profile_image)
watch(OrgDetails,
  (newOrgDetails) => {
    avatarValue.value = newOrgDetails?.values?.logo
  },
);

onMounted(async () => {
  await getSession()
  const { orgDetails } = await $fetch('/api/org')
  localStorage.setItem("orgDetails", JSON.stringify(orgDetails));
})

const handleNavigation = async () => {
  // if (isAnyPlanFree.value) 
  await getSession()
  await checkSubscription()
  if (!session.value.status) {
    clearUser()
    navigateTo("/auth/sign-in")
  }

  emit("closeSheet");
};
const navigateToSamePage = (path: any) => {
  if (route.path === path.path) {
    // If already on the same page, update the query
    router.replace(path);
  }
  if ((path.path === '/billing/view-wallet') && !subcribed.value) {
    toast.error("Please upgrade your plan to access this feature")
  }
};
const redirectToBilling = () => {
  // router.push('/billing')
  navigateTo({ name: 'billing-view-all', query: { type: 'chat' } })
}

const handleDropdownChange = (event: MouseEvent) => {
  event.stopPropagation()
  isDropdownOpen.value = !isDropdownOpen.value;
}

const handleClickOutside = (event: any) => {
  if (dropdownMenu.value && !dropdownMenu.value.$el.contains(event.target)) {
    isDropdownOpen.value = false; // Close dropdown if click outside
  }
};

// Add event listener when the component is mounted
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

// Clean up the event listener when the component is unmounted
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleLogout = async () => {
  localStorage.clear();
  authHandlers.logout();
  logoutModal.value = false;
  navigateTo({ name: "auth-sign-in" });
};
</script>

<style scoped>
.payment-popup {
  position: absolute;
  /* or fixed, depending on your drawer's layout */
  /* Center vertically */
  left: 50%;
  /* Center horizontally */
  transform: translate(-50%, -50%);
  /* background-color: white; */
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  /* Optional, for responsive design */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2), 0px 1px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  /* Ensure it appears above other elements */
}
</style>
