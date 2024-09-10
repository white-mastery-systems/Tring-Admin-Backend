const zodUpdateContacts = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  countryCode: z.string().optional(),
  phone: z.string().optional()
})

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { contactId } = await isValidRouteParamHandler(event, checkPayloadId("contactId"))

  const body: any = await isValidBodyHandler(event, zodUpdateContacts)
  
  const data = await updateContacts(contactId, body)

  return data
})