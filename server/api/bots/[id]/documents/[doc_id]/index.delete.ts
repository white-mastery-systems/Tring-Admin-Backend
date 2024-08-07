import { unlink } from "node:fs/promises";

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { doc_id } = await isValidRouteParamHandler(
    event,
    checkPayloadId("doc_id"),
  );

  const doc = await deleteDocument(doc_id);
  try {
    await unlink(getDocumentPath(doc_id));
  } catch (err) {
    console.error(err);
  }

  return await isValidReturnType(event, doc);
});
