<template>
  <div class="flex flex-col items-center justify-center w-[250px] h-[100vh] bg-[#ffffff] gap-5">
    <div class="flex h-[20vh]">
      <img src="assets\icons\tring_AI_logo.svg" width="80" height="80" />
    </div>
    <!-- <div> -->
    <NuxtLink to="/" @click="handleNavigation"
      class="flex items-center w-[90%] sm:w-[90%] xl:w-[90%] md:w-[80%] md:w-[80%] font-medium cursor-pointer rounded-[10px] gap-3 py-4 px-[18px] field_shadow"
      :class="[route.path === '/' ? 'bg-[#424bd1] text-[#ffffff]' : 'bg-[#ffffff]',]">
      <span>
        <!-- <img v-if="route.path === '/'" src=" assets\icons\activeHome.svg" width="22" height="22" />
        <img v-else src="assets\icons\deactiveHome.svg" width="22" height="22" /> -->
        <!-- <HomeIcon />
        {{ route.path }}
        {{ route.path?.includes('/') }} -->
        <HomeIcon :color="(route.path === '/') ? '#fff' : '#424bd1'" />
      </span>
      <span class="text-[14px]">Dashboard</span>
    </NuxtLink>
    <NuxtLink to="/leads" @click="handleNavigation"
      class="flex items-center w-[90%] sm:w-[90%] xl:w-[90%] md:w-[80%] md:w-[80%] font-medium cursor-pointer rounded-[10px] gap-3 py-4 px-[18px] field_shadow"
      :class="[
        route.path?.includes('/leads') ? 'bg-[#424bd1] text-[#ffffff]' : 'bg-[#ffffff]',
      ]">
      <span>
        <Icon name="mi:bar-chart-alt"
          :class="['h-6 w-6', (route.path?.includes('/leads')) ? 'text-[#fff]' : 'text-[#424bd1]']" />
        <!-- <img v-if="route.path?.includes('/leads')" src="
      assets\icons\analytics_active.svg" width="22" height="22" />
        <img v-else src="assets\icons\analytics_deactive.svg" width="22" height="22" /> -->
      </span>
      <span class="text-[14px]">Leads</span>
    </NuxtLink>
    <NuxtLink to="/bots" @click="handleNavigation"
      class="flex items-center w-[90%] sm:w-[90%] xl:w-[90%] md:w-[80%] md:w-[80%] font-medium cursor-pointer rounded-[10px] gap-3 py-4 px-[18px] field_shadow"
      :class="[route.path?.includes('/bots') ? 'bg-[#424bd1] text-[#ffffff]' : 'bg-[#ffffff]']">
      <span>
        <img v-if="route.path?.includes('/bots')" src=" assets\icons\bot_man_active.svg" width="26"/>
        <img v-else src="assets\icons\bot_man_deactive.svg" width="18" height="22" />
      </span>
      <span class="text-[14px]">Bot Management</span>
    </NuxtLink>
    <NuxtLink to="/settings" @click="handleNavigation"
      class="flex items-center w-[90%] sm:w-[90%] xl:w-[90%] md:w-[80%] md:w-[80%] font-medium cursor-pointer rounded-[10px] gap-3 py-4 px-[18px] field_shadow"
      :class="[
        route.path?.includes('settings') ? 'bg-[#424bd1] text-[#ffffff]' : 'bg-[#ffffff]',
      ]">
      <span>
        <SettingsIcon :color="route.path?.includes('settings') ? '#fff' : '#424bd1'" />

      </span>
      <span class="text-[14px]">Settings</span>
    </NuxtLink>
    <NuxtLink to="/billing" @click="handleNavigation"
      class="flex items-center w-[90%] sm:w-[90%] xl:w-[90%] md:w-[80%] md:w-[80%] font-medium cursor-pointer rounded-[10px] gap-3 py-4 px-[18px] field_shadow"
      :class="[
        route.path?.includes('/billing') ? 'bg-[#424bd1] text-[#ffffff]' : 'bg-[#ffffff]',
      ]">
      <span>
        <WalletIcon :color="route.path?.includes('/billing') ? '#fff' : '#424bd1'" />
        <!-- <img v-if="route.path?.includes('/billing')" src=" assets\icons\payments_active.svg" width="22" height="22" />
        <img v-else src="assets\icons\payments_deactive.svg" width="22" height="22" /> -->
      </span>
      <span class="text-[14px]">Billing</span>
    </NuxtLink>
    <UiButton @click="confirmModel"
      class="mb-8 mt-auto w-3/4 items-start justify-around bg-[#ffffff] pr-12 font-bold text-[#ff0000] hover:bg-gray-300/30 hover:text-[#ff0000] hover:brightness-110"
      variant="ghost">
      <Icon name="ic:round-logout" class="h-6 w-6" />
      <p class="text-base">Logout</p>
    </UiButton>
    <ConfirmationModal v-model:open="modalOpen" title="Confirm Logout" description="Are you sure you want to log out ?"
      @confirm="handleLogout" />
    <!-- </div> -->
  </div>
</template>
<script setup lang="ts">
import { HomeIcon, SettingsIcon, WalletIcon } from "lucide-vue-next";

const route = useRoute();
const modalOpen = ref(false);
const emit = defineEmits(['closeSheet']);

const confirmModel = () => {
  modalOpen.value = true;
};

const handleLogout = () => {
  authHandlers.logout();
  modalOpen.value = false;
};
const handleNavigation = () => {
  emit('closeSheet');
};
</script>
