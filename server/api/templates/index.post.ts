import { createTemplate } from "~/server/utils/db/templates"

const zodInsertTemplates = z.object({
  name: z.string().optional(),
  metadata: z.record(z.any()).optional(),
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