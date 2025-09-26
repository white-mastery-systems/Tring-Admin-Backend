export default defineEventHandler(async (event) => {
  // await isOrganizationAdminHandler(event);
  const { id: docId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  return await getDocumentById(docId);
});