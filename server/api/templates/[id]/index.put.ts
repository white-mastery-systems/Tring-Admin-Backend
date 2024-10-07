const zodUpdateTemplate = z.object({
  name: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

export default defineEventHandler(async(event) => { 
  await isOrganizationAdminHandler(event)

  const { id: templateId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body = await isValidBodyHandler(event, zodUpdateTemplate)

  const data = await updateTemplateById(templateId, body)

  return data
})