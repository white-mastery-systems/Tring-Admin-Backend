const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const { id: documentId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  await db
    .update(documentSchema)
    .set({ status: "error" })
    .where(eq(documentSchema.id, documentId));

  return `Document with ${documentId} processing not succeeded`;
});
