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

  const organizationDetails = await $fetch("/api/org", {
    method: "GET",
  });
  const organizationId = organizationDetails?.orgDetails?.id;

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
        src: `${config.public.chatBotBaseUrl}/widget.js`,
        type: "text/javascript",
        defer: true,
        "data-orgname": "WMS",
        "data-chatbotid": `${config.tringCustomerSupport}`,
        "data-orgid": `${organizationId}`,
      },
    ],
  });
</script>
