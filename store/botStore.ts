export const botStore = defineStore('bot', () => {
  // Reactive array state
  const scrapedData = ref<string[]>([])
  const voiceBotScrapedData = ref<string[]>([])
  const siderBarslider = ref(true)
  const lastVisitedRoute = ref('')
  const createBotsuccessfulState = ref({
    open: false,
  })
  const createBotVoiceSuccessfulState = ref({
    open: false,
    handleContent: false,
  })
  return { scrapedData, siderBarslider, lastVisitedRoute, voiceBotScrapedData, createBotsuccessfulState, createBotVoiceSuccessfulState }
})