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

  const confirmation = await $fetch(
    `/api/billing/webhook?hostedpage_id=${hostedpageId}`,
  );
</script>

<template>
  <div><h1>Billing Confirmation</h1></div>
</template>
