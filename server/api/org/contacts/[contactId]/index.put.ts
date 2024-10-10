const zodUpdateContacts = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  countryCode: z.string().optional(),
  phone: z.string().optional()
})

const db = useDrizzle()

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { contactId } = await isValidRouteParamHandler(event, checkPayloadId("contactId"))

  const body: any = await isValidBodyHandler(event, zodUpdateContacts)

   const isAlreadyExists = await db.query.contactSchema.findFirst({
    where: and(
      ne(contactSchema.id, contactId),
      eq(contactSchema.phone, body?.phone)
    )
  })

  if(isAlreadyExists) {
     return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "phone number already exists",
      }),
    );
  }
  
  const data = await updateContacts(contactId, body)

  return data
})