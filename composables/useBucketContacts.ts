import { unref } from "vue";

export const useBucketContacts = (bucketId: any) => {
  const { data, status, error, refresh } = useLazyFetch<SelectChatBot & { documents: SelectDocument[] }>(
    () => `/api/org/contact-list/${unref(bucketId)}`,
    { watch: false } // Ensures it doesn't auto-refresh unless triggered manually
  );

  return {
    bucketDetails: data,
    loading: status,
    error,
    refreshBucket: refresh, // Expose refresh function
  };
};
