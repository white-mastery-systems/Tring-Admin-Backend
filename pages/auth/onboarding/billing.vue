<template>
<ViewAllPlans :onBoardingAccount="true" />
</template>
<script setup lang="ts">
definePageMeta({
  layout: "sign-up-success",
  middleware: "guest-only",
});
</script>