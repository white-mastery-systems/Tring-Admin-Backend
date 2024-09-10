import { createContacts } from "~/server/utils/db/contacts"

const zodInsertContacts = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  countryCode: z.string().optional(),
  phone: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const { id: contactListId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body = await isValidBodyHandler(event, zodInsertContacts)

  const data = await createContacts({
    ...body,
    organizationId,
    contactListId
  })

  return data
})