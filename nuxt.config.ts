import autoImports from "./autoImports";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true, timeline: { enabled: true } },

  components: [
    { path: "~/components", pathPrefix: false, extensions: ["vue"] },
  ],

  ssr: false,

  modules: [
    "@nuxtjs/tailwindcss",
    "@formkit/auto-animate",
    "@nuxt/icon",
    "nuxt-typed-router",
    "shadcn-nuxt",
    "@vueuse/nuxt",
  ],

  nitro: {
    experimental: { openAPI: true },
    imports: {
      dirs: ["server/schema/**", "server/utils/**"],
      presets: [...autoImports.nitro],
    },
  },

  imports: {
    dirs: ["stores/**", "composables/**", "utils/**"],
    presets: [...autoImports.nuxt],
  },

  shadcn: {
    prefix: "Ui",
  },

  runtimeConfig: {
    dbUrl: "",
    redisUrl: "",
    llmBaseUrl: "",
    botBaseUrl: "",
    redirectUrl: "",
  },

  vite: {
    optimizeDeps: {
      exclude: ["vee-validate"],
    },
  },
});
