<!-- <template>
  <NuxtLoadingIndicator :color="'#424bd1'" />
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
  <UiToaster rich-colors position="top-center" :duration="3000" />
</template>
<script setup lang="ts">
const layout = useState('layout')
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
</script> -->

<template>
  <!-- <NuxtLoadingIndicator :color="'#424bd1'" />
  <UiSidebarProvider>
    <AppSidebar />
    <main class="flex">
      <UiSidebarTrigger />
      <NuxtPage />
    </main>
  </UiSidebarProvider>
  <UiToaster rich-colors position="top-center" :duration="3000" /> -->
  <NuxtLoadingIndicator :color="'#424bd1'" />
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
  <UiToaster rich-colors position="top-center" :duration="3000" />
</template>

<script setup lang="ts">
  const config = useRuntimeConfig();

  useHead({
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded",
        media: "print",
        onload: "this.onload=null;this.removeAttribute('media');",
      },
    ],
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${config.public.googleAnalyticsId}`,
        async: true,
      },
      {
        src: "https://checkout.razorpay.com/v1/checkout.js",
        async: true,
      },
      {
        src: "http://localhost:3001/widget.js",
        type: "text/javascript",
        defer: true,
        "data-orgname": "WMS",
        "data-chatbotid": "b75338b4-9163-4ad7-8a0f-a7cc11834b11",
        "data-orgid": "b2461433-c379-4c84-a844-6ab31c39ccd9",
      },
    ],
  });
</script>
