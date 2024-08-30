<template>
  <div>
    <div class="billing-main-container h-full">
      <div>
        <SubscriptionManage />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

definePageMeta({
  middleware: "admin-only",
});

const { user } = await useUser();
// const orgBilling = await $fetch("/api/org/usage");

</script>