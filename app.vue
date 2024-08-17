<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UiToaster rich-colors position="top-center" :duration="3000" />
</template>
<script setup lang="ts">
  useHead({
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
  });
</script>
