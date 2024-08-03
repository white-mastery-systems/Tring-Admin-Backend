import autoImports from "./autoImports";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true, timeline: { enabled: true } },

  components: [
    { path: "~/components", pathPrefix: false, extensions: ["vue"] },
  ],

  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@formkit/auto-animate",
    "@nuxt/icon",
    "nuxt-typed-router",
  ],

  nitro: {
    imports: {
      dirs: ["server/schema/**", "server/utils/**"],
      presets: [...autoImports.nitro],
    },
  },

  imports: {
    presets: [...autoImports.nuxt],
  },

  runtimeConfig: {
    dbUrl: "",
    redisUrl: "",
  },
});
