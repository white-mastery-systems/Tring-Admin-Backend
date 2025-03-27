export const useElevenLabsVoices = (apiKey: Ref<string> | string) => {
    const { data, status, error, refresh } = useLazyFetch<ElevenLabsVoice[]>(
      () => `/api/tts-integration/elevenlabs/voices?apiKey=${encodeURIComponent(unref(apiKey))}`,
      { 
        watch: false, // Ensures it doesn't auto-refresh unless triggered manually
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    return {
      elevenlabsVoiceList: data,
      loading: status,
      error,
      refreshVoices: refresh, // Expose refresh function
    };
  };
  
  // Define the type for Eleven Labs voice response
  interface ElevenLabsVoice {
    voice_id: string;
    name: string;
    preview_url?: string;
    category?: string;
    description?: string;
    // Add any other properties returned by the API
  }