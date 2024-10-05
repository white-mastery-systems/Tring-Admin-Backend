const zodUpdateTemplate = z.object({
  name: z.string().optional(),
  header: z.string().optional(),
  headerText: z.string().optional(),
  headerFile: z.string().optional(),
  headerLocation: z.string().optional(),
  body: z.string().optional(),
  footer: z.string(),
  templateVariables: z.array(z.string()).optional()
})

export default defineEventHandler(async(event) => { 
  await isOrganizationAdminHandler(event)

  const { id: templateId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body = await isValidBodyHandler(event, zodUpdateTemplate)

  const data = await updateTemplateById(templateId, body)

  return data
})