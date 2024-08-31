export const listDocumentsByBotId = async (botId: string) => {
  const documentsList = await $fetch(`/api/bots/${botId}/documents`);

  return {
    ...documentsList,
    documents: documentsList?.documents.map((document) => ({
      ...document,
      createdAt: formatDate(new Date(document.createdAt), "dd.MM.yyyy"),
    })),
  };
};

export const deployDocument = async (botId: string, documentId: string) => {
  await $fetch(`/api/bots/${botId}/documents/${documentId}/deploy`);
  toast.success("Document deployed successfully");
  await navigateTo({
    name: "bots-id",
    params: { id: botId },
  });
};

export const viewDocument = async (botId: string, documentId: string) => {
  navigateTo(`/api/bots/${botId}/documents/${documentId}`, {
    external: true,
    open: {
      target: "_blank",
    },
  });
};

export const deleteDocument = async (botId: string, documentId: string) => {
  await $fetch(`/api/bots/${botId}/documents/${documentId}`, {
    method: "DELETE",
  });
  toast.success("Document deleted successfully");
};

export const createDocument = async (
  botId: string,
  document: { name: string; files: File },
) => {
  const form = new FormData();

  form.append("name", document.name);
  form.append("files", document.files);

  await $fetch(`/api/bots/${botId}/documents`, {
    method: "POST",
    body: form,
  });

  toast.success("Document added successfully");
};

export const uploadLogo = async (botId: string, logo: File) => {
  const form = new FormData();
  form.append("logo", logo);
  await $fetch(`/api/bots/${botId}/add-logo`, {
    method: "POST",
    body: form,
  });
};
