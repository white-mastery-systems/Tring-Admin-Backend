<template>
  <ViewAllPlans />
</template>
<script setup lang="ts">
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store

definePageMeta({
  middleware: 'user',
});

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
</script>