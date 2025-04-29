import { inArray } from "drizzle-orm"
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
  if(enrich){
    if(botUser.name || botUser.email || botUser.company || botUser.company){
      const payload = { 
        ...enrich, 
        ...((!enrich.name && botUser.name) && {name: botUser.name}),
        ...((!enrich.email && botUser.email) && {email: botUser.email}),
        ...((!enrich.company && botUser.company) && { company: botUser.company }),
        ...((!enrich.companyUrl && botUser.companyUrl) && { companyUrl: botUser.companyUrl }),
      }
      const data = await updateWhatsappEnrichmentById(enrich.id, payload)
      return data
    }
    return enrich
  }
  return createWhatsappEnrichment({
    organizationId: botUser.organizationId,
    botUserId: botUser.id,
    integrationId: integrationId,
    phone: botUser.mobile,
    ...(botUser.company && {company: botUser.company,}),
    ...(botUser.companyUrl && {companyUrl: botUser.companyUrl,}),
    ...(botUser.name && { name: botUser.name }),
    ...(botUser.email && { email: botUser.email }),
    countryCode: botUser.countryCode,
  })
}

export const getEnrichByEmailOrPhone = async (email:string, phone?:string) => {
  const conditions = [eq(whatsappEnrichmentSchema.email, email)];

  if (phone) {
    conditions.push(eq(whatsappEnrichmentSchema.phone, phone));
  }
  return await db.query.whatsappEnrichmentSchema.findFirst({
    where: or(...conditions),
    with: { integration: true, botUser: true },
  });
}

export const getEnrichByCompanyUrl = async (companyUrl:string) => {
  return await db.query.whatsappEnrichmentSchema.findFirst({
    where: or(eq(whatsappEnrichmentSchema.companyUrl, companyUrl), eq(whatsappEnrichmentSchema.company, companyUrl))
  })
}

export const updateWhatsappEnrichStatusById = async (id: string, status: "new"| "responded" | "meeting_link_sent" | "meeting_booked" | "meeting_cancelled" | "meeting_rescheduled" | "completed", metadata:any) => {
  return (await db.update(whatsappEnrichmentSchema).set({ status, metadata }).where(eq(whatsappEnrichmentSchema.id, id)).returning())[0];
}

export const bookedWhatsappEnrichList = async () => {
  return await db.select({
    id: whatsappEnrichmentSchema.id, phone: whatsappEnrichmentSchema.phone
  })
  .from(whatsappEnrichmentSchema).where(inArray(whatsappEnrichmentSchema.status, ["meeting_rescheduled","meeting_booked"]))
}
