<template>
  <ViewAllPlans :onBoardingAccount="false" />
</template>
<script setup lang="ts">
import { useSubscriptionCheck } from '~/composables/billing/useSubscriptionCheck';

definePageMeta({
  middleware: 'user',
});

const { isAnyPlanFree, checkSubscription } = useSubscriptionCheck()

onMounted(async () => {
  if (isAnyPlanFree.value) await checkSubscription()
})
</script>