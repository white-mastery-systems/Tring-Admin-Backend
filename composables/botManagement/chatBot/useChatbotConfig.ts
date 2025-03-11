import { ref, onMounted } from 'vue';

export function useChatbotConfig() {
  const intentOptions = ref<any>(null);
  const status = ref<string | null>(null);
  const error = ref<string | null>(null);

  // Define fetchConfig so that you pass the type as an argument
  const fetchConfig = async (type: string) => {
    try {
      const { data, status: fetchStatus, error: fetchError } = await useLazyFetch(
        `/api/v2/chatbot/config?type=${type}`,
        {
          server: false,
          default: () => ({}),
        }
      );
      intentOptions.value = data.value;
      status.value = fetchStatus.value;

      if (fetchError.value) {
        throw new Error(fetchError.value);
      }
    } catch (err: any) {
      error.value = err.message || "Failed to fetch configuration";
    }
  };

  // Optionally, you can call fetchConfig on mount with a default type
  onMounted(() => {
    // fetchConfig("default-type"); // Uncomment and set a default if needed.
  });

  return {
    intentOptions,
    status,
    error,
    fetchConfig,
  };
}
