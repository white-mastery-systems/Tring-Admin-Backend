import { writeFile } from "node:fs/promises";

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  // Data Validation
  const formData = await readMultipartFormData(event);
  // console.log({
  //   formData: formData
  //     .find(({ callback_url }: { callback_url: string }) => callback_url)
  //     ?.data.toString()!,
  // });
  if (!formData) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid Document Data",
      }),
    );
  }
  // console.log()
  const body = zodInsertDocument.safeParse({
    name: formData.find(({ name }) => name === "name")?.data.toString()!,
    botId,
  });
  if (!body.success)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid Document Data(name)",
        data: body.error.format(),
      }),
    );
  const fileData = formData.find(({ name }) => name === "files");
  if (!fileData?.data)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid Document Data(files)",
      }),
    );

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
      callbackUrl: `${process.env.LLM_CALLBACK_URL}/api/documents/${document.id}`,
    }),
  );

  $fetch(`/rag/document`, {
    method: "POST",
    baseURL: process.env.LLM_BASE_URL,
    body: form,
  });

  return document;
});
