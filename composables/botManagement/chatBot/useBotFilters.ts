// composables/useBotFilters.ts
export function useBotFilters() {
  const filters = useState("chatBotFilters", () => ({
    q: "", // Search query
    active: "", // Filter by active status
    page: "1", // Default page
    limit: "10", // Items per page
    type: "", // Bot type filter
  }));

  return { filters };
}
