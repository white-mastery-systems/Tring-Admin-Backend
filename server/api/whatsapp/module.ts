const db = useDrizzle()

export const getIntegrationByOrgId = async (organizationId:string, integrationId?:string | undefined) => {
    if(integrationId){
        const integrationDetails = await db.query.integrationSchema.findFirst({
          where: and(
            eq(integrationSchema.id, integrationId),
            eq(integrationSchema.org_id, organizationId),
            eq(integrationSchema.crm, "whatsapp"),
            eq(integrationSchema.type, "whatsapp"),
          ),
        });
        return integrationDetails;
    }
    const integrationDetails = await db.query.integrationSchema.findFirst({
    where: and(
        eq(integrationSchema.org_id, organizationId),
        eq(integrationSchema.crm, "whatsapp"),
        eq(integrationSchema.type, "whatsapp"),
    ),
    });
    return integrationDetails
}