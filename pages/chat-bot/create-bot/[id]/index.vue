<template>
  <div>
    <CreateBotForm />
  </div>
</template>
<script setup lang="ts">
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
import { useRoute } from 'vue-router'

const route = useRoute();
const queryId = ref(route.params.id);
const breadcrumbStore = useBreadcrumbStore();
breadcrumbStore.setBreadcrumbs([
  {
    label: "Create Bot", // Dynamic name
    to: `/chat-bot/create-bot/${queryId.value}`,
  },
]);
</script>