import { useBotFilters } from './useBotFilters'
// composables/useBotList.ts
export function useBotList() {
  const { filters } = useBotFilters(); // Get filters from composable

  // Pagination data
  const page = ref(0);
  const totalPageCount = ref(0);
  const totalCount = ref(0);

  const { status, refresh, data: bots } = useLazyFetch("/api/bots", {
    server: false,
    query: filters.value, // Pass reactive filters
    default: () => [],
    headers: {
      "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    transform: (bots: any = {}) => {
      page.value = bots.page;
      totalPageCount.value = bots.totalPageCount;
      totalCount.value = bots.totalCount;

      return bots.data.map((bot: any) => ({
        id: bot.id,
        name: bot.name,
        status: !!bot.documentId, // Convert to boolean
        createdAt: bot.createdAt, //formatDate(new Date(bot.createdAt), "dd.MM.yyyy")
        type: useBotType(bot.type as BotType),
      }));
    },
  });

  return { botListStatus:status, bots, refresh, page, totalPageCount, totalCount };
}
