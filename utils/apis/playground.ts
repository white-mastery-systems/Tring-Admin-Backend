export interface DocumentResponse {
  name: string;
  status: "processing" | "ready" | "error";
  id: string;
  createdAt: Date;
  botId: string;
}

export const addPlaygroundDocument = async (document: {
  name: string;
  files: File;
}) => {
  const form = new FormData();

  form.append("name", document.name);
  form.append("files", document.files);

  const documentResponse: DocumentResponse = await $fetch(`/api/playground/document`, {
    method: "POST",
    body: form,
  });

  toast.success("Document added successfully");
  return documentResponse;
};
