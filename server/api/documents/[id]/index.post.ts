const db = useDrizzle();
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { id: documentId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  console.log("LLM SERVER DOCUMENT SUCCESS: ", documentId);

  await db
    .update(documentSchema)
    .set({
      status: "ready",
    })
    .where(eq(documentSchema.id, documentId));

  return `Document with ${documentId} processing succeeded`;
});
