import { unlink } from "node:fs/promises";

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const { doc_id } = await isValidRouteParamHandler(
    event,
    checkPayloadId("doc_id"),
  );

  const doc = await deleteDocument(doc_id);

  $fetch(`/rag/document/${doc_id}`, {
    method: "DELETE",
    baseURL: config.llmBaseUrl
  });
  
  const botDetails = await getBotDetailsNoCache(botId)
  if(botDetails?.documentId === doc_id) {
    updateBotDetails(botId, { documentId: null, status: "inactive" })
  }
  
  try {
    await unlink(getDocumentPath(doc_id));
  } catch (err) {
    console.error(err);
  }

  return await isValidReturnType(event, doc);
});