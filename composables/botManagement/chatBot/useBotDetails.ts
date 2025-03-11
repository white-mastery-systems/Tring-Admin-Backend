export const useBotDetails = (botId: Ref<string> | string) => {
  const { data, pending, error, refresh } = useLazyFetch<SelectChatBot & { documents: SelectDocument[] }>(
    () => `/api/bots/${unref(botId)}`,
    { watch: false } // Ensures it doesn't auto-refresh unless triggered manually
  );

  return {
    botDetails: data,
    loading: pending,
    error,
    refreshBot: refresh, // Expose refresh function
  };
};
