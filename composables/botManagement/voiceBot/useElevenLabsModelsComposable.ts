import { unref } from 'vue';
import { useLazyFetch } from '#app';

// Define the type for Eleven Labs model response
interface ElevenLabsModel {
  model_id: string;
  name: string;
  description?: string;
  token_cost_factor?: number;
  max_characters_per_request?: number;
  // Add any other properties returned by the API
}

export const useElevenLabsModels = (apiKey: any) => {
  const { data, status, error, refresh } = useLazyFetch<ElevenLabsModel[]>(
    () => `/api/tts-integration/elevenlabs/models?apiKey=${encodeURIComponent(unref(apiKey))}`,
    {
      watch: false, // Ensures it doesn't auto-refresh unless triggered manually
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );

  return {
    elevenlabsModelList: data,
    modelsloading: status,
    modelsError: error,
    refreshModels: refresh, // Expose refresh function
  };
};