import { writeFile } from "node:fs/promises";
import { zodInsertPlaygroundDocument } from "~/server/schema/admin";
import { createPlaygroundDocument } from "~/server/utils/db/document";

type UUID = string;

export default defineEventHandler(async (event) => {

  // Data Validation
  const formData = await readMultipartFormData(event);

  if (!formData) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Missing Document Data: No form data was provided. Please ensure the document data is included in the request.",
      }),
    );
  }

  const body = zodInsertPlaygroundDocument.safeParse({
    name: formData.find(({ name }) => name === "name")?.data.toString()!,
  });

  if (!body.success) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Invalid Document Name: The 'name' field is either missing or invalid. Please check the provided name.",
        data: body.error.format(),
      }),
    );
  }

  const fileData = formData.find(({ name }) => name === "files");
  if (!fileData?.data) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Missing Files: No file data was provided. Please upload a valid document file.",
      }),
    );
  }
  
  // Create Document
  const document = await createPlaygroundDocument(body.data);
  await writeFile(getDocumentPath(document.id), fileData.data);

  // Create Form Data
  const form = new FormData();
  const { data, filename, ...rest } = fileData;
  const file = new File([data], filename!, rest);

  const hostname = getRequestHost(event);

  form.append("name", body.data.name?.replace(/[^a-zA-Z0-9.]/g, ""));
  form.append("files", file);
  form.append(
    "req",
    JSON.stringify({
      document_id: document.id,
      model_req: {
        provider: "openai",
        model_name: "",
        messages: [],
      },
      callback_url: `https://tring-admin.pripod.com/api/documents/${document.id}`,
    }),
  );

  $fetch(`/rag/document`, {
    method: "POST",
    body: form,
    baseURL: process.env.LLM_BASE_URL,
  });

  return document;
});
