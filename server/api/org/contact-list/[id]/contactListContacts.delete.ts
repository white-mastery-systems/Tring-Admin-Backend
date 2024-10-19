const db = useDrizzle()

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event)

  const { id: contactListId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body = await isValidBodyHandler(event, z.object({ contactId: z.string() }))

  const data = (await db.delete(contactListContactsSchema).where(
    and(
      eq(contactListContactsSchema.contactListId, contactListId),
      eq(contactListContactsSchema.contactId, body.contactId)
    )
  ).returning())[0]

  return data
})