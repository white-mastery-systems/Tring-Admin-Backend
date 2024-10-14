~<template>
  <div class="flex h-[100vh] w-[250px] flex-col items-center gap-5 overflow-y-scroll bg-[#ffffff]">
    <NuxtLink to="/" class="flex h-[15%] w-full justify-center bg-[#ffffff]">
      <img class="self-center pt-[50px] sm:pt-[50px] md:pt-[50px] lg:pt-7 xl:pt-7"
        src="assets\icons\Tring-Ai-Logo-with-black-text.png" width="190" height="190" />
    </NuxtLink>
    <div class="flex w-full flex-col items-center gap-4 overflow-scroll pb-6 pt-4">
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
              <UiAccordionTrigger class="w-full no-underline hover:no-underline">
                {{ name }}</UiAccordionTrigger>
            </div>
            <div class="rounded-b-lg">
              <UiAccordionContent v-for="(item, index) in children" :key="item.path"
                class="text-md border border-none bg-[#F0F6FF] py-4 pl-12 font-bold" :class="[
                    route.path?.includes(path + item.path) && 'text-[#424bd1]',
                  index === children.length - 1 ? 'rounded-b-lg' : '',
                ]">
                <NuxtLink :to="path + item.path">
                  {{ item.name }}
                </NuxtLink>
              </UiAccordionContent>
            </div>
          </UiAccordionItem>
        </UiAccordion>
        <NuxtLink v-else-if="!!(path !== '/')" :to="path" @click="handleNavigation"
          class="field_shadow flex w-[90%] cursor-pointer items-center gap-3 rounded-[10px] px-[18px] py-4 font-medium"
          :class="[
            route.path?.includes(path)
              ? 'bg-[#424bd1] text-[#ffffff]'
              : 'bg-[#ffffff]',
          ]">
          <WhatsappIcon v-if="(path === '/whatsapp-bot')"></WhatsappIcon>
          <component :is="icon"></component>

          <span class="text-[14px]">{{ name }}</span>
        </NuxtLink>
        <NuxtLink v-else :to="path" @click="handleNavigation"
          class="field_shadow flex w-[90%] cursor-pointer items-center gap-3 rounded-[10px] px-[18px] py-4 font-medium"
          :class="[
            route.path === path
              ? 'bg-[#424bd1] text-[#ffffff]'
              : 'bg-[#ffffff]',
          ]">
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
          <span class="font-bold capitalize max-w-[150px] truncate">{{ userInfo?.username }}</span>
          <span class="max-w-[150px] truncate">{{ userInfo?.email }}</span>
        </div>
      </NuxtLink>
    </div>

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
    StarsIcon,
    WalletIcon,
    UserIcon,
  } from "lucide-vue-next";
  const { user } = await useUser();
  // watch(user, (newUserInfo) => {
  //
  // });
  const userInfo = computed(() => {
    return user.value;
  });
  const accordionItems = [
    {
      value: "item-1",
      title: "Is it accessible?",
      content: "Yes. It adheres to the WAI-ARIA design pattern.",
    },
    {
      value: "item-2",
      title: "Is it unstyled?",
      content:
        "Yes. It's unstyled by default, giving you freedom over the look and feel.",
    },
    {
      value: "item-3",
      title: "Can it be animated?",
      content:
        "Yes! You can use the transition prop to configure the animation.",
    },
  ];
  const route = useRoute();
  const emit = defineEmits(["closeSheet"]);
  const navigationModules = ref([
    {
      name: "Home",
      icon: HomeIcon,
      path: "/",
      children: [],
    },
    {
      name: "Analytics",
      icon: ChartNoAxesColumnIncreasing,
      path: "/analytics",
      children: [
        {
          name: "Leads",
          path: "/leads",
        },
        {
          name: "Chats",
          icon: MessageCircle,
          children: [],
          path: "/chats",
        },
      ],
    },
    {
      name: "Contacts",
      icon: UserIcon,
      path: "/contacts-management",
      children: [
        {
          name: "Contacts",
          path: "/contacts",
        },
        {
          name: "Buckets",
          path: "/buckets",
        },
        {
          name: "Campaigns",
          path: "/campaigns",
        },
      ],
    },
    {
      name: "Bot Management",
      icon: Bot,
      path: "/bot-management",
      children: [
        {
          name: "Voice Bot",
          path: "/voice-bot",
        },
        {
          name: "Chat Bot",
          path: "/chat-bot",
        },
      ],
    },
    {
      name: "Whatsapp Bot",
      icon: '',
      path: "/whatsapp-bot",
      children: [],
    },
    {
      name: "Settings",
      icon: SettingsIcon,
      path: "/settings",
      children: [
        {
          name: "Playground",
          icon: StarsIcon,
          path: "/playground",
        },
        {
          name: "Integrations",
          icon: SettingsIcon,
          path: "/integration",
        },
        {
          name: "User Management",
          icon: SettingsIcon,
          path: "/user-management",
        },
        {
          name: "Whatsapp Template",
          icon: SettingsIcon,
          path: "/whatsapp-template",
        },
      ],
    },
    {
      name: "Billing",
      icon: WalletIcon,
      path: "/billing",
      children: [],
    },
  ]);
  const openAccordions: any = ref({
    path: route.path.split('/').slice(0, 2).join('/')
  });
const handleNavigation = () => {
  emit("closeSheet");
};
</script>