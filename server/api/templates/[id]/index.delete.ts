export default defineEventHandler(async(event) => { 
  await isOrganizationAdminHandler(event)

  const { id: templateId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const data = await deleteTemplateById(templateId)

  return data
})