import { unref } from 'vue';
import { useLazyFetch } from '#app';

export const useDocumentsList = (routeId: any) => {
  const { data, pending, error, refresh } = useLazyFetch<SelectDocument[]>(
    () => `/api/bots/${unref(routeId)}/intents`,
    { watch: false } // Ensures it doesn't auto-refresh unless triggered manually
  );

  return {
    documentsList: data,
    loading: pending,
    error,
    refreshDocuments: refresh, // Expose refresh function
  };
};
