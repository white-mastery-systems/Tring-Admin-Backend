import { ref } from 'vue';

export function useContentSuggestions() {
  const contentSuggestions = ref(null);
  const suggestionLoading = ref(false);
  const suggestionError = ref(null);

  const fetchSuggestions = async (industry: any) => {
    if (!industry) {
      console.warn("No industry provided");
      return;
    }
    try {
      suggestionLoading.value = true;
      suggestionError.value = null;
      console.log("Fetching with industry:", industry);

      const response = await fetch('/api/content-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ industry }),
      });

      const data = await response.json();
      // Check if the response contains an error statusCode
      if (data && data.statusCode && data.statusCode >= 400) {
        // This handles the server error wrapped in a 200 response
        throw new Error(`API Error: ${data.statusCode} - ${data.body?.error || 'Unknown error'}`);
      }

      // If we made it here, the data is valid
      contentSuggestions.value = data;
    } catch (err) {
      toast.error("Failed to fetch suggestions");
      contentSuggestions.value = null; // Reset in case of error

      // Fall back to config API if content-suggestions fails
      try {
        const fallbackResponse = await fetch(`/api/v2/chatbot/config?type=${industry}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          contentSuggestions.value = fallbackData;
          suggestionError.value = null; // Clear error if fallback succeeds
        }
      } catch (fallbackErr) {
        console.error("Fallback also failed:", fallbackErr);
        // Keep the original error if fallback fails
      }
    } finally {
      suggestionLoading.value = false;
    }
  };

  return {
    contentSuggestions,
    suggestionLoading,
    suggestionError,
    fetchSuggestions,
  };
}