<template>
    <div class="w-full h-full">
        <OnBoardingChatBillingPlan />
    </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "billing-account",
  middleware: "guest-only",
});

import { useRoute, useRouter } from 'vue-router';
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store

const breadcrumbStore = useBreadcrumbStore();
const correctedUrl = ref('');
const router = useRouter();
const route = useRoute();

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
    if (!route.query.type) { // If `type` is not present in the query
      router.push({ query: { type: 'chat' } });
    }
    if (route.query.type) {
      correctedUrl.value = `/billing?type=${route.query.type}`;
    }
});
</script>