export const listDocumentsByBotId = async (botId: string) => {
  const documentsList = await $fetch(`/api/bots/${botId}/documents`);
  return documentsList;
};
