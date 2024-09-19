import VueGtag, { trackRouter, useGtag } from "vue-gtag-next";

// https://nuxt.com/docs/guide/directory-structure/plugins
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  nuxtApp.vueApp.use(VueGtag, {
    property: {
      id: config.public.googleAnalyticsId,
    },
    useDebugger: true, // Enable debugger in all environments for easier troubleshooting
    disableScriptLoad: true, // Let Nuxt handle script loading
    enabled: true, // Enable tracking in all environments, adjust as needed
  });

  trackRouter(useRouter());

  // Make gtag methods globally available
  const { event, pageview, screenview, customMap, time, exception } = useGtag();

  return {
    provide: {
      gtag: {
        event,
        pageview,
        screenview,
        customMap,
        time,
        exception,
      },
    },
  };
});
