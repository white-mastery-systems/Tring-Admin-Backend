<template>
  <ViewAllPlans :onBoardingAccount="false" />
</template>
<script setup lang="ts">
import { useSubscriptionCheck } from '~/composables/billing/useSubscriptionCheck';
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store

definePageMeta({
  middleware: 'user',
});

const { isAnyPlanFree, checkSubscription } = useSubscriptionCheck()
const breadcrumbStore = useBreadcrumbStore();

breadcrumbStore.setBreadcrumbs([
  {
    label: "Billing", // Dynamic name
    to: `/billing?type=chat`,
  },
  {
    label: 'Choose a Plan',
    to: `/billing/view-all?type=chat`,
  },
])
onMounted(async () => {
  if (isAnyPlanFree.value) await checkSubscription()
})
</script>