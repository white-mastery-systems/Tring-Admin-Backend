const db = useDrizzle();

export const getIntegrationDetails = async (
    integrationId: string,
) => {
    const data = await db.query.integrationSchema.findFirst({
        where: eq(integrationSchema.id, integrationId),
    });
    return data?.metadata;
}