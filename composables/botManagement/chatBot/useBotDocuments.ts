// export function useBotDocuments(botId: string | number) {
//   const { status, refresh, data: documents } = useLazyFetch(
//     () => `/api/bots/${botId}/documents`,
//     {
//       server: false,
//       transform: (docs: any = {}) => ({
//         ...docs,
//         documents: (docs.documents ?? []).map((d: any) => ({
//           ...d,
//           createdAt: formatDate(new Date(d.createdAt), "dd.MM.yyyy"),
//         })),
//       }),
//     }
//   );

//   return { status, documents, refresh };
// }
export function useBotDocuments(botId: string | number) {
  const page = ref(1);
  const totalPageCount = ref(0);
  const totalCount = ref(0);

  const { status, refresh, data: documents } = useLazyFetch(
    () => `/api/bots/${botId}/documents`,
    {
      server: false,
      transform: (docs: any = {}) => {
        // Set the pagination values
        page.value = docs.page || 1;
        totalPageCount.value = docs.totalPageCount || 0;
        totalCount.value = docs.totalCount || 0;

        return {
          ...docs,
          documents: (docs.documents ?? []).map((d: any) => ({
            ...d,
            createdAt: formatDate(new Date(d.createdAt), "dd.MM.yyyy"),
          })),
        };
      },
    }
  );

  return {
    status,
    documents,
    refresh,
    page,
    totalPageCount,
    totalCount
  };
}