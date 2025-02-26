export const botStore = defineStore('bot', () => {
  // Reactive array state
  const scrapedData = ref<string[]>([])

  return { scrapedData }
})
