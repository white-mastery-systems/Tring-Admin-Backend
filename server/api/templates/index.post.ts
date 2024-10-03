import { createTemplate } from "~/server/utils/db/templates"

const zodInsertTemplates = z.object({
  name: z.string().optional(),
  header: z.string().optional(),
  headerText: z.string().optional(),
  headerFile: z.string().optional(),
  headerLocation: z.string().optional(),
  body: z.string().optional(),
  templateVariables: z.array(z.string()).optional()
})

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const body = await isValidBodyHandler(event, zodInsertTemplates)

  const data = await createTemplate({
    ...body,
    organizationId,
  })
  return data
})