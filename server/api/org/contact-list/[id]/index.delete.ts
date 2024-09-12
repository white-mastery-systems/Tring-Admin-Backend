export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)
  const { id: contactListId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const data = await deleteContactList(contactListId)
  return data
})