import { writeFile } from "node:fs/promises";

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
  const file = formData.find(({ name }) => name === "file")?.data;
  if (!file)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid Document Data",
      }),
    );

  // Create Document
  const document = await createDocument(body.data);
  await writeFile(getDocumentPath(document.id), file);

  // TODO: Add document to Vectorstore

  return document;
});
