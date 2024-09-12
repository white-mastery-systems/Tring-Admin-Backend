const zodUpdateContactList = z.object({
  name: z.string().optional()
})

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { id: contactListId} = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body: any = await isValidBodyHandler(event, zodUpdateContactList)

  const update = await updateContactList(contactListId, body)

  return update;
})