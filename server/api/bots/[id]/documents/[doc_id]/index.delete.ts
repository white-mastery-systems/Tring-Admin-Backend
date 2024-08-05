export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { doc_id } = await isValidRouteParamHandler(
    event,
    checkPayloadId("doc_id"),
  );

  const doc = await deleteDocument(doc_id);
  return await isValidReturnType(event, doc);
});
