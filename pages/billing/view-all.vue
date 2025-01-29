<template>
  <ViewAllPlans :onBoardingAccount="false" />
</template>
<script setup lang="ts">
definePageMeta({
  middleware: 'user',
});

</script>