const db = useDrizzle();

export const createWhatsappEnrichment = async (data: any) => (await db.insert(whatsappEnrichmentSchema).values(data).returning())[0];

export const updateWhatsappEnrichmentById = async (id: string, data:any) => {
    return (await db.update(whatsappEnrichmentSchema).set(data).where(eq(whatsappEnrichmentSchema.id, id)).returning())[0]
}

export const fetchEnrichByPhoneOrCreate = async (botUser:any, integrationId:string)=> {
const enrich = await db.query.whatsappEnrichmentSchema.findFirst({
    where: and(
        eq(whatsappEnrichmentSchema.phone, botUser.mobile),
        eq(whatsappEnrichmentSchema.countryCode, botUser.countryCode),
        eq(whatsappEnrichmentSchema.organizationId, botUser.organizationId),
    )
})
if(enrich){ return enrich }
return createWhatsappEnrichment({
    organizationId: botUser.organizationId,
    botUserId: botUser.id,
    integrationId: integrationId,
    phone: botUser.mobile,
    ...(botUser.name && { name: botUser.name }),
    ...(botUser.email && { email: botUser.email }),
    countryCode: botUser.countryCode,
})
}

export const getEnrichByEmail = async (email:any) => {
  // botUserId integrationId
  return await db.query.whatsappEnrichmentSchema.findFirst({
    where: eq(whatsappEnrichmentSchema.email, email),
    with: { integration: true, botUser: true },
  });
}