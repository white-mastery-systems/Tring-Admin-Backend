import { removeTemplateById } from "~/server/utils/db/templates"

export default defineEventHandler(async(event) => { 
  await isOrganizationAdminHandler(event)

  const { id: templateId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const data = await removeTemplateById(templateId)

  return data
})