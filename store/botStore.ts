export const botStore = defineStore('bot', () => {
  // Reactive array state
  const scrapedData = ref<string[]>([])
  const siderBarslider = ref(true)
  return { scrapedData, siderBarslider }
})
