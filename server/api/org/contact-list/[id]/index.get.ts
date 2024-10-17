const db = useDrizzle()

export default defineEventHandler(async (event) => {
   const organizationId = await isOrganizationAdminHandler(event)

   const { id: contactListId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

   let data = await getContactListById(contactListId)

   const contacts = await db.query.contactSchema.findMany({
    where: eq(contactSchema.organizationId, organizationId)
   })

   const contactDetails = data.contactIds.map((item: any) => contacts.filter((j) => j.id === item ))
    
   data = {
     ...data,
     contactDetails
   }

   return data
})