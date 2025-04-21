<template>
  <ViewOnBoardingBilling />
</template>
<script setup lang="ts">
definePageMeta({
  layout: "billing-account",
  middleware: "guest-only",
});
</script>