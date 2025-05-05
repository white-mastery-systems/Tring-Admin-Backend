import { unlink } from "node:fs/promises";

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const doc = await deleteDocument(id);

  $fetch(`/rag/document/${id}`, {
    method: "DELETE",
    baseURL: config.llmBaseUrl
  });
  
  try {
    await unlink(getDocumentPath(id));
  } catch (err) {
    console.error(err);
  }

  return await isValidReturnType(event, doc);
});
