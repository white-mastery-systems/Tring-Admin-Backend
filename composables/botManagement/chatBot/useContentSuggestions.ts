import { ref } from 'vue';

export function useContentSuggestions() {
  const contentSuggestions = ref(null);
  const suggestionLoading = ref(false);
  const suggestionError = ref(null);
  
  const fetchSuggestions = async (industry) => {
    if (!industry) {
      console.warn("No industry provided");
      return;
    }
    
    try {
      suggestionLoading.value = true;
      suggestionError.value = null;
      
      console.log("Fetching with industry:", industry);
      
      // Use direct fetch instead of useFetch
      const response = await fetch('/api/content-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ industry }), // Explicitly stringify the JSON
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      
      const data = await response.json();
      contentSuggestions.value = data;
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      suggestionError.value = err.message || "Failed to fetch suggestions";
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