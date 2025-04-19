<template>
    <div>
      <CreateVoiceBotForm />
    </div>
  </template>
  <script setup lang="ts">
  import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
  
  const breadcrumbStore = useBreadcrumbStore();
  breadcrumbStore.setBreadcrumbs([
    {
      label: "Create Bot", // Dynamic name
      to: `/voice-bot/create-voice-bot`,
    },
  ]);
  </script>