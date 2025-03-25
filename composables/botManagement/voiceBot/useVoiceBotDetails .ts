export const useVoiceBotDetails = (botId: Ref<string> | string) => {
  const { data, status, error, refresh } = useLazyFetch<SelectChatBot & { documents: SelectDocument[] }>(
    () => `/api/voicebots/${unref(botId)}`,
    { watch: false } // Ensures it doesn't auto-refresh unless triggered manually
  );

  return {
    botDetails: data,
    loading: status,
    error,
    refreshBot: refresh, // Expose refresh function
  };
};