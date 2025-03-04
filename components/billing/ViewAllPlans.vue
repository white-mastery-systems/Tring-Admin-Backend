<template>
  <!-- <div v-if="isPageLoading" class="grid h-[80vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div> -->
  <Page title="Billings" :description="true" :disableSelector="true" :customBackRouter="correctedUrl"
    :disable-back-button="(currentRoute === 'onboarding/billing')" class="relative">
    <UiTabs v-model="selectedTab" :default-value="route.query.type ?? 'chat'" class="w-full self-start">
      <UiTabsList class="grid w-full grid-cols-2">
        <UiTabsTrigger value="chat" @click="navigateToTab('chat')">
          Chat
        </UiTabsTrigger>
        <UiTabsTrigger value="voice" @click="navigateToTab('voice')">
          Voice
        </UiTabsTrigger>
      </UiTabsList>
      <!-- <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
        <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
      </div> -->
      <div>
        <UiTabsContent value="chat">
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

const props = withDefaults(defineProps<{ onBoardingAccount?: boolean }>(), {
  onBoardingAccount: false, // Default value for accept
});
const correctedUrl = ref('');
const router = useRouter();
const route = useRoute();

// Reactive computed property for plan selection
const currentRoute = computed(() => {
  const fullPath = router.options.history.state.current
  if (!fullPath) return '';
  return fullPath.split('/auth/')[1] || '';
});

onMounted(() => {
  // if ((route.name !== 'auth-onboarding-billing')) {
    if (!route.query.type) { // If `type` is not present in the query
      router.push({ query: { type: 'chat' } });
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