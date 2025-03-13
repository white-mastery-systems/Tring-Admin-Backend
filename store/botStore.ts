export const botStore = defineStore('bot', () => {
  // Reactive array state
  const scrapedData = ref<string[]>([])
  const siderBarslider = ref(false)
  return { scrapedData, siderBarslider }
})
