export const useContentSuggestions = (industry: any) => {
    console.log(unref(industry), "industry composables"); // Ensure it's unwrapped for logging
    const { data, status, error, refresh } = useLazyFetch(
      () => '/api/content-suggestions',
      {
        method: 'POST',
        body: { industry: unref(industry) || 'real-estate' },
        watch: false, // Ensures it doesn't auto-refresh unless triggered manually
      }
    );
  
    return {
      contentSuggestions: data,
      loading: status,
      error,
      refreshSuggestions: refresh, // Expose refresh function
    };
  };
  