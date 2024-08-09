import { writeFile } from "node:fs/promises";

const conf = useRuntimeConfig();

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
        statusMessage: "Invalid Document Data",
      }),
    );
  }
  const body = zodInsertDocument.safeParse({
    name: formData.find(({ name }) => name === "name")?.data.toString()!,
    botId,
  });
  if (!body.success)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid Document Data",
        data: body.error.format(),
      }),
    );
  const fileData = formData.find(({ name }) => name === "files");
  if (!fileData?.data)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid Document Data",
      }),
    );

  // Create Document
  const document = await createDocument(body.data);
  await writeFile(getDocumentPath(document.id), fileData.data);

  // Create Form Data
  const form = new FormData();
  const { data, filename, ...rest } = fileData;
  const file = new File([data], filename!, rest);
  
  form.append("name", body.data.name);
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
      callback_url: `http://${getRequestHost(event)}/api/documents/${document.id}`,
    }),
  );

  $fetch(`rag/document`, {
    method: "POST",
    baseURL: conf.llmBaseUrl,
    body: form,
  });

  return document;
});
