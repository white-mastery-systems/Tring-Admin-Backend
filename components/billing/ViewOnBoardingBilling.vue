<template>
    <div class="w-full h-full">
        <OnBoardingChatBillingPlan :onBoardingAccount="onBoardingAccount" />
    </div>
  <!-- </Page> -->
</template>
<script setup lang="ts">
definePageMeta({
  layout: "billing-account",
  middleware: "guest-only",
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