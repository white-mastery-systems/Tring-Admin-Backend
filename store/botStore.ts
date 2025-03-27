export const botStore = defineStore('bot', () => {
  // Reactive array state
  const scrapedData = ref<string[]>([])
  const voiceBotScrapedData = ref<string[]>([])
  const siderBarslider = ref(true)
  const lastVisitedRoute = ref('')
  return { scrapedData, siderBarslider, lastVisitedRoute, voiceBotScrapedData }
})
