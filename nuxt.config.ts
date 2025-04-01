import autoImports from "./autoImports";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true, timeline: { enabled: true } },

  // devServer: {
  //   host: process.env.HOST ?? "127.0.0.1",
  //   port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  // },
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
    "@pinia/nuxt",
  ],
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
      autoprefixer: {},
    },
  },

  nitro: {
    experimental: { openAPI: true },
    imports: {
      dirs: ["server/schema/**", "server/utils/**"],
      presets: [...autoImports.nitro],
    },
    storage: {
      log: {
        driver: "fs",
        base: "./logs",
      },
    },
    plugins: [
      "~/server/plugin/yaml-watcher.ts",
      "~/server/plugin/schedule-voicebotDialer.ts",
      "~/server/plugin/saleshandy-analytics.ts",
      "~/server/plugin/schedule-chatbotCall.ts",
      "~/server/plugin/schedule-chatExpiry.ts",
    ],
  },

  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
        },
      ],
    },
  },

  imports: {
    dirs: ["stores/**", "composables/**", "utils/**"],
    presets: [...autoImports.nuxt],
  },

  shadcn: {
    prefix: "Ui",
  },

  // runtimeConfig: {
  //   dbUrl: "",
  //   redisUrl: "",
  //   llmBaseUrl: "",
  //   botBaseUrl: "",
  //   redirectUrl: "",
  //   logoDir: "",
  //   llmCallbackUrl: "",
  //   playGroundBotId: "",
  //   fileUrl: "",
  //   secretKey: "",
  //   nodemailerUser: "",
  //   nodemailerPass: "",
  //   adminBaseUrl: "",
  //   reserveGoUrl: "",
  //   envType: "",
  //   openApiKey: "",
  //   public: {
  //     googleAnalyticsId: "",
  //     voiceBotUrl: "",
  //     chatBotUrl: "",
  //     adminUrl: process.env.NUXT_ADMIN_URL || "",
  //   },
  // },

  runtimeConfig: {
    dbUrl: "",
    llmBaseUrl: "",
    redirectionUrl: "",
    playGroundBotId: "",
    nodemailerUser: "",
    nodemailerPass: "",
    secretKey: "",
    envType: "",
    openaiApiKey: "",
    geminiApiKey: "",
    tringPlivoAuthId: "",
    tringPlivoAuthToken: "",
    public: {
      adminBaseUrl: "",
      chatBotBaseUrl: "",
      voiceBotBaseUrl: "",
      widgetUrl: process.env.NUXT_PUBLIC_WIDGET_URL || "",
      googleAnalyticsId: "",
      zohoIndianChatSubscription: process.env.NUXT_PUBLIC_ZOHO_INDIAN_CHAT_SUBSCRIPTION || "",
      zohoIndianVoiceFluentSubscription: process.env.NUXT_PUBLIC_ZOHO_INDIAN_VOICE_FLUENT_SUBSCRIPTION || "",
      zohoIndianVoiceLucidSubscription: process.env.NUXT_PUBLIC_ZOHO_INDIAN_VOICE_LUCID_SUBSCRIPTION || "",
      zohoInternationalChatSubscription: process.env.NUXT_PUBLIC_ZOHO_INTERNATIONAL_CHAT_SUBSCRIPTION || "",
      zohoInternationalVoiceFluentSubscription: process.env.NUXT_PUBLIC_ZOHO_INTERNATIONAL_VOICE_FLUENT_SUBSCRIPTION || "",
      zohoInternationalVoiceLucidSubscription: process.env.NUXT_PUBLIC_ZOHO_INTERNATIONAL_VOICE_LUCID_SUBSCRIPTION || "",
      contactUsUrl: process.env.NUXT_PUBLIC_CONTACTUSURL || "",
    },
  },

  vite: {
    optimizeDeps: {
      exclude: ["vee-validate"],
      include: ["chokidar", "js-yaml"],
    },
  },

  plugins: ["~/plugins/vue-gtag.client"],
});
