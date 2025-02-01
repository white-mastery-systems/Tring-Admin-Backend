~
<template>
  <div class="flex h-[100vh] w-[250px] flex-col items-center gap-5 overflow-y-scroll bg-[#ffffff]">
    <!-- style="box-shadow: 0px 0px 24px 0px #00000000 !important;" -->
    <NuxtLink to="/" class="flex w-full justify-center">
      <img class="self-center pt-[50px] sm:pt-[50px] md:pt-[50px] lg:pt-[26px] xl:pt-[26px]"
        src="assets\icons\Tring-Ai-Logo-with-black-text.png" width="190" height="190" />
    </NuxtLink>
    <div class="flex w-full flex-col items-center gap-4 overflow-scroll pb-[60px] pt-3">
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
                ]">
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
          <span class="text-[14px]">{{ name }}</span>
        </NuxtLink>
      </template>
      <NuxtLink class="flex relative w-[90%] items-center gap-2 rounded-xl border-[1px] border-[var(border)] px-2 py-1"
        to="/account" :class="[
          route.path === '/account'
            ? 'bg-[#424bd1] text-[#ffffff]'
            : 'bg-[#ffffff]',
        ]">
        <UiAvatar>
          <UiAvatarImage class="capitalize" :src="avatarValue" :alt="userInfo?.username" />
          <UiAvatarFallback>{{
            userInfo?.username?.toUpperCase()?.charAt(0)
            }}</UiAvatarFallback>
        </UiAvatar>

        <div class="flex flex-col">
          <span class="max-w-[150px] truncate font-bold capitalize">{{
            userInfo?.username
            }}</span>
          <span class="max-w-[150px] truncate">{{ userInfo?.email }}</span>
        </div>
        <div v-if="isAnyPlanFree"
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
      </NuxtLink>
      <!-- <div class="absolute bottom-0 w-full"> -->
      <!-- </div> -->
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
  LucideArrowUpRight,
  } from "lucide-vue-next";
import { useRoute } from "vue-router";
import { useOrgDetailsStore } from "~/store/orgDetailsStore";
import { useSubscriptionCheck } from '~/composables/billing/useSubscriptionCheck';
// import { useSubscriptionCheck } from '~/composables/useSubscriptionCheck';

const { isAnyPlanFree } = useSubscriptionCheck()

  const { user } = await useUser();
// const freeTrialPopup = ref(false)
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
        {
          name: "Call Logs",
          icon: MessageCircle,
          children: [],
          path: "/call-logs",
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
      icon: "",
      path: "/whatsapp-bot",
      children: [],
    },
    {
      name: "Settings",
      icon: SettingsIcon,
      path: "/settings",
      children: [
        // {
        //   name: "Playground",
        //   icon: StarsIcon,
        //   path: "/playground",
        // },
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
    path: route.path.split("/").slice(0, 2).join("/"),
  });
  const OrgDetails = useOrgDetailsStore();
  const avatarValue = ref(OrgDetails.values?.logo || userInfo.value?.profile_image)
  watch(OrgDetails,
    (newOrgDetails) => {
      avatarValue.value = newOrgDetails?.values?.logo
    },
  );
  onMounted(async() => {
    const { orgDetails } = await $fetch('/api/org')
    localStorage.setItem("orgDetails", JSON.stringify(orgDetails));
    
    // const orgBilling = await $fetch("/api/org/subscriptionPlans");
    // // const isAnyPlanFree = orgBilling[1].planCode.includes("_free")
    // const isAnyPlanFree = orgBilling.every((plan: any) => plan.planCode.includes("_free"))
    // if (isAnyPlanFree) freeTrialPopup.planFree = true
    // else freeTrialPopup.planFree = false
  })

const handleNavigation = () => {
  emit("closeSheet");
};
const redirectToBilling = () => {
  // router.push('/billing')
  navigateTo({ name: 'billing-view-all', query: { type: 'chat'} })
}
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
