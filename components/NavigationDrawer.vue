<template>
  <div
    class="flex h-[100vh] w-[250px] flex-col items-center justify-center gap-5 bg-[#ffffff] overflow-y-scroll pt-[80px] sm:pt-[80px] md:pt-[80px] lg:pt-0 xl:pt-0">
    <div class="flex h-[20vh]">
      <img src="assets\icons\tring_AI_logo.svg" width="80" height="80" />
    </div>
    <template v-for="{ name, icon, path } in navigationModules" :key="path">
      <NuxtLink v-if="!!(path !== '/')" :to="path" @click="handleNavigation"
        class="field_shadow flex w-[90%] cursor-pointer items-center gap-3 rounded-[10px] px-[18px] py-4 font-medium sm:w-[90%] md:w-[80%] xl:w-[90%]"
        :class="[
          route.path?.includes(path)
            ? 'bg-[#424bd1] text-[#ffffff]'
            : 'bg-[#ffffff]',
        ]">
        <component :is="icon"></component>

        <span class="text-[14px]">{{ name }}</span>
      </NuxtLink>
      <NuxtLink v-else :to="path" @click="handleNavigation"
        class="field_shadow flex w-[90%] cursor-pointer items-center gap-3 rounded-[10px] px-[18px] py-4 font-medium sm:w-[90%] md:w-[80%] xl:w-[90%]"
        :class="[
          route.path === path ? 'bg-[#424bd1] text-[#ffffff]' : 'bg-[#ffffff]',
        ]">
        <!-- note i tried merge this if else didn't worked so did this way -->
        <component :is="icon"></component>
        <span class="text-[14px]">{{ name }}</span>
      </NuxtLink>
    </template>
    <NuxtLink class="flex w-[90%] items-center gap-2 rounded-xl border-[1px] border-[var(border)] px-2 py-1"
      to="/account" :class="[
        route.path === '/account'
          ? 'bg-[#424bd1] text-[#ffffff]'
          : 'bg-[#ffffff]',
      ]">
      <UiAvatar>
        <UiAvatarImage class="capitalize" :src="userInfo?.profile_image" :alt="userInfo?.username" />
        <UiAvatarFallback>{{
          userInfo?.username?.toUpperCase()?.charAt(0)
          }}</UiAvatarFallback>
      </UiAvatar>

      <div class="flex flex-col">
        <span class="font-bold capitalize">{{ userInfo?.username }}</span>
        <span>{{ userInfo?.email }}</span>
      </div>
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
  import {
    Bot,
    ChartNoAxesColumnIncreasing,
    HomeIcon,
    MessageCircle,
    SettingsIcon,
    WalletIcon,
  } from "lucide-vue-next";
  const { user } = await useUser();
  // watch(user, (newUserInfo) => {
  //   console.log({ newUserInfo });
  // });
  const userInfo = computed(() => {
    return user.value;
  });

  const route = useRoute();
  const modalOpen = ref(false);
  const emit = defineEmits(["closeSheet"]);
  const navigationModules = ref([
    {
      name: "Home",
      icon: HomeIcon,
      path: "/",
    },
    {
      name: "Leads",
      icon: ChartNoAxesColumnIncreasing,
      path: "/leads",
    },
    {
      name: "Bots",
      icon: Bot,

      path: "/bots",
    },
    {
      name: "Chats",
      icon: MessageCircle,

      path: "/chats",
    },
    {
      name: "Settings",
      icon: SettingsIcon,
      path: "/settings",
    },
    {
      name: "Billing",
      icon: WalletIcon,
      path: "/billing",
    },
  ]);

  const confirmModel = () => {
    modalOpen.value = true;
  };

  const handleLogout = () => {
    authHandlers.logout();
    modalOpen.value = false;
  };
  const handleNavigation = () => {
    emit("closeSheet");
  };
</script>
