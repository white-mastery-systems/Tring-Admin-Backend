<template>
  <NuxtLoadingIndicator :color="'#424bd1'" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UiToaster rich-colors position="top-center" :duration="3000" />
</template>
<script setup lang="ts">
  const config = useRuntimeConfig();
  useHead({
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${config.public.googleAnalyticsId}`,
        async: true
      }
    ]
  });
</script>
