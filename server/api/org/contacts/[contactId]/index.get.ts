export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { contactId } = await isValidRouteParamHandler(event, checkPayloadId("contactId"))
  
  const data = await getContactsById(contactId)

  return data
})