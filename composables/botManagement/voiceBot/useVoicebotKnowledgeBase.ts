import { ref, onMounted } from 'vue';
import { useLazyFetch } from '#app'; // Assuming you're using Nuxt 3

export function useVoicebotKnowledgeBase() {
  const knowledgeBaseData = ref<any>(null);
  const status = ref<string | null>(null);
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  /**
   * Fetch knowledge base data for voicebots by industry type
   * @param industryType The type of industry to fetch data for (e.g., 'real-estate')
   */
  const fetchKnowledgeBase = async (industryType: string) => {
    console.log(industryType, "industryType - industryType")
    try {
      loading.value = true;

      const { data, status: fetchStatus, error: fetchError, execute } = useLazyFetch(
        `/api/voicebots/knowledgeBase?industryType=${industryType}`,
        {
          server: false,
          default: () => ({}),
        }
      );

      // Trigger the request manually
      await execute();

      knowledgeBaseData.value = data.value;
      status.value = fetchStatus.value;

    } catch (err: any) {
      loading.value = false;
      error.value = err.message || "Failed to fetch voicebot knowledge base";
    }
    loading.value = false;
  };

  // You can uncomment this if you want to fetch with a default industry type on mount
  // onMounted(() => {
  //   fetchKnowledgeBase("real-estate");
  // });

  return {
    knowledgeBaseData,
    status,
    voiceKnowLoader: loading,
    error,
    fetchKnowledgeBase,
  };
}