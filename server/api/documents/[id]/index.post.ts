const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event) as string;
  const { id: documentId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const document = (await db
    .update(documentSchema)
    .set({
      status: "ready",
    })
    .where(eq(documentSchema.id, documentId))
    .returning())[0]

  const adminUser: any = await getAdminByOrgId(organizationId);

  if (adminUser?.id) {
    const connections = global.userConnections?.get(adminUser?.id) || [];
    connections.forEach((connection) => {
      connection({ event: "Document is ready", data: document });
    });
  }

  return `Document with ${documentId} processing succeeded`;
});
