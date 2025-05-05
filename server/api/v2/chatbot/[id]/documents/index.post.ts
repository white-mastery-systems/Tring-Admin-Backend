import { writeFile } from "node:fs/promises";

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  // Data Validation
  const formData = await readMultipartFormData(event);

  if (!formData) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Invalid Document Data: No form data was provided. Please ensure all required fields are included in the request.",
      }),
    );
  }

  const body = zodInsertDocument.safeParse({
    name: formData.find(({ name }) => name === "name")?.data.toString()!,
    botId,
  });
  if (!body.success) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Invalid Document Data (name): The 'name' field in the document data is invalid or missing. Please verify the input and try again.",
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
          "Invalid Document Data (files): The 'files' field is missing or invalid. Please ensure a valid file is provided.",
      }),
    );
  }
  // Create Document
  const document = await createDocument(body.data);
  await writeFile(getDocumentPath(document.id), fileData.data);

  // Create Form Data
  const form = new FormData();
  const { data, filename, ...rest } = fileData;

  const file = new File([data], filename!, rest);

  const hostname = getRequestHost(event);

  form.append("name", body.data.name?.replace(/[^a-zA-Z0-9.]/g, ""));
  form.append("files", file);

  form.append(
    "ragRequest",
    JSON.stringify({
      documentId: document.id,
      ragModelRequest: {
        provider: "openai",
        modelName: "",
        messages: [],
      },
      callbackUrl: `${config.public.adminBaseUrl}/api/documents/${document.id}`,
    }),
  );

  $fetch(`/rag/document`, {
    method: "POST",
    baseURL: config.llmBaseUrl,
    body: form,
  });

  return document;
});