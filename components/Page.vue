<template>
  <!-- :class="[
    props.disablePadding ? '' : (
      leadPage === 'leads'
        ? (browserClass === 'brave-browser'
          ? 'px-3 pb-2 pt-[100px] sm:px-3 md:px-4 md:pt-4 lg:px-4 lg:pt-4 xl:px-4'
          : 'px-3 pb-2 pt-[60px] sm:px-3 md:px-4 md:pt-4 lg:px-4 lg:pt-4 xl:px-4')
        : 'px-3 py-2 sm:px-3 md:px-4 md:pt-4 lg:px-4 lg:pt-4 xl:px-4'
    ),
  ]" -->
  <div class="w-full pl-5 pt-2" v-if="breadCrumbs?.length > 0">
    <UiBreadcrumb>
      <UiBreadcrumbList>
        <UiBreadcrumbItem v-for="({ label, to }, index) in breadCrumbs" :key="index"
          :class="index === breadCrumbs.length - 1 ? 'text-blue-600' : ''">
          <UiBreadcrumbLink :href="to">{{ label }}</UiBreadcrumbLink>

          <UiBreadcrumbSeparator v-if="index < breadCrumbs.length - 1" />
        </UiBreadcrumbItem>
      </UiBreadcrumbList>
    </UiBreadcrumb>
  </div>
 <!-- px-2 sm:px-2 md:px-6 lg:px-6 xl:px-6 -->
  <div class="overflow-y-auto" :class="[(route.path === '/auth/onboarding/billing') ? 'h-[100dvh] min-w-[80%]' : 'h-[calc(100dvh-2.5rem)]',
    props.disablePadding 
      ? '' 
    : `${(leadPage === 'leads') ? (browserClass === 'brave-browser') ? 'pt-[10px] sm:pt-[10px]' : 'pt-[10px] sm:pt-[10px]' : 'pb-2 sm:pb-2'} md:pt-0 lg:pt-0 xl:pt-0`,
    'pb-2'
  ]">
    <div :class="[(props.title) ? 'justify-between' : 'justify-end', (!props.disableSelector) ? 'py-3' : 'py-3' ]"
      class="flex items-center gap-2 px-2 sm:px-2 md:px-6 lg:px-6 xl:px-6">
      <div v-if="props.title"
        :class="['flex gap-4 px-0', (!props.disableBackButton) ? 'items-center' : 'items-center']">
        <!-- <UiButton v-if="!props.disableBackButton" variant="outline" size="icon" @click="handleBackButtonClick">
          <component :is="ArrowLeft"></component>
        </UiButton> -->
        <span v-if="!props.disableBackButton" @click="handleBackButtonClick">
          <component :is="ArrowLeft"></component>
        </span>
        <!-- <div v-else class="block sm:block md:block lg:hidden xl:hidden">
          <navigationSheet />
        </div> -->
        <div>
          <h3
            className="max-w-[120px] sm:max-w-[120px] md:max-w-[400px] text-[15px] sm:text-[15px] md:text-[26px] lg:text-[26px] xl:text-[26px] font-bold tracking-tight truncate">
            {{ title }}
          </h3>
          <h4 v-if="props.subTitle" className="text-[12px]">
            {{ props?.subTitle }}
          </h4>
        </div>
      </div>

      <slot name="actionButtons"></slot>
    </div>
    <UiSeparator v-if="!(route.path === '/auth/onboarding/billing')" orientation="horizontal" class="bg-[#E2E8F0] w-full" />
    <!-- <LazyUiSelectSeparator v-if="!props.disableSelector" class="mb-4 bg-[#E2E8F0]" /> -->

    <!-- mt-4 -->
    <!-- shadow-3xl -->
    <!-- mt-4 -->
    <div class="flex flex-col justify-center sm:justify-center md:justify-start gap-4" :class="[
      props.disableElevation
        ? ''
        : ((route.path === `/chat-bot/${route.params.id}`)) ? 'px-1 sm:px-1 lg:p-0 xl:p-0' : 'p-2 sm:p-2 lg:p-0 xl:p-0 pb-[14px] mb-[95px] sm:mb-[90px] md:mb-0 lg:mb-0 xl:mb-0 overflow-scroll rounded-md bg-white p-1', ((route.path === '/auth/onboarding/billing') || (route.path === `/chat-bot/${route.params.id}`)) 
      ? 'md:px-6 lg:px-6 xl:px-6 pt-0' 
      : 'md:p-6 lg:p-6 xl:p-6'
    ]">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { useRoute } from "vue-router";

const props = withDefaults(
  defineProps<{
    title: string;
    disableElevation?: boolean;
    disablePadding?: boolean;
    disableBackButton?: boolean;
    titleSize?: string;
    actionRows?: any;
    actionButtons?: any;
    subTitle?: string;
    customBackRouter?: string;
    disableSelector?: boolean;
    breadCrumbs?: any;
    leadPage:string;
  }>(),
  {
    actionButtons: [],
    actionRows: [],
    subTitle: "",
    disableElevation: false,
    disablePadding: false,
    disableBackButton: false,
    titleSize: "medium",
    disableSelector: false,
    breadCrumbs: [],
    leadPage: "",
  },
);
const router = useRouter();
const route = useRoute();
const handleBackButtonClick = () => {
  if (props.customBackRouter) {
    navigateTo(props.customBackRouter);
  } else {
    router.back();
  }
};
const browserClass = computed(() => {
  const userAgent = navigator.userAgent;

  // Detect Brave browser
  const isBrave = navigator.brave || (/Brave/i.test(userAgent) && /Chrome/i.test(userAgent));

  if (isBrave) {
    return 'brave-browser';
  } else if (/chrome/i.test(userAgent) && !isBrave) {
    return 'chrome-browser';
  } else if (/firefox/i.test(userAgent)) {
    return 'firefox-browser';
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    return 'safari-browser';
  } else {
    return '';
  }
});
</script>
