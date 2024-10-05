import { createContacts } from "~/server/utils/db/contacts"

const db = useDrizzle()

const zodInsertContacts = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  countryCode: z.string().optional(),
  phone: z.string().optional(),
  organizationId: z.string().optional()
})


export default defineEventHandler(async (event) => {
  // const organizationId = (await isOrganizationAdminHandler(event)) as string

  const { id: contactListId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body = await isValidBodyHandler(event, zodInsertContacts)
  const organizationId = event?.context?.user?.organizationId ?? body.organizationId
  const isAlreadyExists = await db.query.contactSchema.findFirst({
    where: and(
      eq(contactSchema.contactListId, contactListId),
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

  const data = await createContacts({
    ...body,
    organizationId: organizationId,
    contactListId
  })

  return data
})