export const usePrerecordedAudioMetadata = (
  botId: Ref<string> | string,
  organizationId: Ref<string> | string
) => {
  const config = useRuntimeConfig();

  const { data, status, refresh, error } = useLazyFetch(
    () => `${config.public.voiceBotBaseUrl}/prerecordedAudio/metaData`,
    {
      server: false,
      params: {
        bot_id: unref(botId),
        organization_id: unref(organizationId)
      },
      default: () => [],
      watch: false // Ensures it doesn't auto-refresh unless triggered manually
    }
  );

  return {
    audioResponseData: data,
    loading: status,
    error,
    audioDataRefresh: refresh // Expose refresh function
  };
};