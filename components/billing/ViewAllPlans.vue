<template>
  <!-- <div v-if="isPageLoading" class="grid h-[80vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div> -->
  <!-- {{ currentRoute }} -->
  <!-- {{ route.query.type }} -->
  <!-- {{ `onboarding/billing?type=${route.query.type}` }} -->
  <!-- (currentRoute === `onboarding/billing?type=${route.query.type}`) ? '' : -->
  <Page title="Choose a Plan" :description="true" :disableSelector="true" :customBackRouter="correctedUrl"
    :disable-back-button="(currentRoute === `onboarding/billing?type=${route.query.type}`)" class="relative">
    <UiTabs v-model="selectedTab" :default-value="route.query.type ?? 'chat'"
      class="w-full sm-w-full md:min-w-[900px]">
      <UiTabsList
        class="flex flex-col grid w-full sm:w-full md:w-[300px] grid-cols-2 gap-5 px-2 pb-2 pt-0 rounded-lg bg-white border-0">
        <UiTabsTrigger value="chat" @click="navigateToTab('chat')"
          class="flex flex-col items-center gap-1 justify-center border rounded-lg data-[state=active]:border-primary min-h-[91px] min-w-[85px]">
          <MessageSquare class="w-6 h-6" />
          <span class="mt-1 text-sm">Chat</span>
        </UiTabsTrigger>

        <UiTabsTrigger value="voice" @click="navigateToTab('voice')"
          class="flex flex-col items-center gap-1 justify-center border rounded-lg data-[state=active]:border-primary min-h-[91px] min-w-[85px]">
          <PhoneCall class="w-6 h-6" />
          <span class="mt-1 text-sm">Voice</span>
        </UiTabsTrigger>
      </UiTabsList>
      <!-- <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
        <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
      </div> -->
      <div>
        <UiTabsContent value="chat" class="w-full">
          <ChatAndVoiceBillingPlan :onBoardingAccount="onBoardingAccount" />
        </UiTabsContent>
        <UiTabsContent value="voice">
          <ChatAndVoiceBillingPlan :onBoardingAccount="onBoardingAccount" />
        </UiTabsContent>
      </div>
    </UiTabs>
  </Page>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

import { useRoute, useRouter } from 'vue-router';
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
import { Receipt, CircleDollarSign, MessageSquare, PhoneCall } from "lucide-vue-next";

const props = withDefaults(defineProps<{ onBoardingAccount?: boolean }>(), {
  onBoardingAccount: false, // Default value for accept
});
const breadcrumbStore = useBreadcrumbStore();
const correctedUrl = ref('');
const router = useRouter();
const route = useRoute();

// // Reactive computed property for plan selection
// const currentRoute = computed(() => {
//   const fullPath = router.options.history.state.current
//   if (!fullPath) return '';
//   return fullPath.split('/auth/')[1] || '';
// });
const currentRoute = computed(() => {
  const fullPath = router.currentRoute.value.fullPath; // Access current route
  return fullPath.includes('/auth/') ? fullPath.split('/auth/')[1] : '';
});
const callType = computed(() => (route.query.type === 'chat' ? 'Chat' : 'Voice'));

watch(() => route.query.type, (newType) => {
  breadcrumbStore.setBreadcrumbs([
    {
      label: 'Billing',
      to: `/billing?type=${newType}`, // Ensure a valid query parameter
    },
    {
      label: callType.value, // Ensure `.value` is used inside watchEffect
      to: `/billing/view-all?type=${newType}`, // Ensure correct query format
    },
  ]);
},{deep: true, immediate: true});

onMounted(() => {
  // if ((route.name !== 'auth-onboarding-billing')) {
    if (!route.query.type) { // If `type` is not present in the query
      router.push({ query: { type: 'chat' } });
    }
    if (route.query.type) {
      correctedUrl.value = `/billing?type=${route.query.type}`;
    }
    // const currentUrl = router.options.history.state.back || 'billing/view-all';
    // if (!currentUrl.includes('?type=chat') && !currentUrl.includes('?type=voice')) {
    //   correctedUrl.value = `/billing?type=chat`;
    // } else if (currentUrl.includes('?type=voice')) {
    //   correctedUrl.value = `/billing?type=voice`;
    // } else if (currentUrl.includes('?type=chat')) {
    //   correctedUrl.value = `/billing?type=chat`;
    // }
  // }
});

const navigateToTab = (tab) => {
  router.push({ query: { ...route.query, type: tab } })
  correctedUrl.value = `/billing?type=${tab}`;
}
</script>