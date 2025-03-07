export function useBotDocuments(botId: string | number) {
  const { status, refresh, data: documents } = useLazyFetch(
    () => `/api/bots/${botId}/documents`,
    {
      server: false,
      transform: (docs: any = {}) => ({
        ...docs,
        documents: (docs.documents ?? []).map((d: any) => ({
          ...d,
          createdAt: formatDate(new Date(d.createdAt), "dd.MM.yyyy"),
        })),
      }),
    }
  );

  return { status, documents, refresh };
}
