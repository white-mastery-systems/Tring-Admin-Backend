<template>
  <div class="grid h-full items-center justify-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
</template>
<script setup lang="ts">
  const route = useRoute();
  const hostedpageId = route.query.hostedpage_id;

  if (!hostedpageId) {
    toast.error("Payment Not Confirmed, Reach us for more details", {
      duration: 3000,
    });
    setTimeout(async () => {
      await navigateTo("/");
    }, 1000);
  }

  await $fetch(`/api/v2/billing/wallet/verify-payment`, {
    method: "POST",
    body: {
      hostedpageId,
    },
  });
  toast.success("Payment Confirmed");
  navigateTo({ 
    name: "billing-view-wallet",
    query: { type: route.query?.type ?? 'chat' },
  });
</script>