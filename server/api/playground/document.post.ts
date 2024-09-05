import { writeFile } from "node:fs/promises";

type UUID = string;

const conf = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const botId: UUID = "eee8fd62-e52b-4cf9-84af-a7c7fe30cc80";

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
    baseURL: conf.llmBaseUrl,
  });

  return document;
});
