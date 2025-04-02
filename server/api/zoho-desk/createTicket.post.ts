import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { createTicketInZohoDesk, getZohoDeskApiKey } from "~/server/utils/v2/integrations/crm/zoho/zoho-desk"

const zodCreateTicketValidation = z.object({
  orgId: z.string(),
  botId: z.string(),
  type: z.enum(["voice", "chat"]),
  subject: z.string(),
  description: z.string(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  resolution: z.string().optional(),
  priority: z.string().optional(),
  language: z.string().optional(),
  channel: z.string().optional(),
  classification: z.string().optional(),
  webUrl: z.string().optional()
})

export default defineEventHandler(async (event) => {
  try {
    const body = await isValidBodyHandler(event, zodCreateTicketValidation)

    const adminDetails = await getAdminByOrgId(body?.orgId)

    const integrationData = await getZohoDeskApiKey({ botId: body.botId, type: body.type })
    if(!integrationData.status) {
      return errorResponse(event, 400, integrationData.message)
    }
    const { botId, type, ...payload }  = body
    const ticketPayload = {
      ...payload,
      departmentId: "191068000000280029",
      email: adminDetails?.email,
      firstName: adminDetails?.username,
      phone: `${adminDetails?.countryCode} ${adminDetails?.mobile}`
    };

    const data = await createTicketInZohoDesk({ integrationData: integrationData.data?.integrationData, body: ticketPayload })
    if(!data.status) {
      return errorResponse(event, 500, "Unable to create ticket in zoho-desk")
    }
    return { status: true }
  } catch (error: any) {
    logger.error(`Zoho-desk Create API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to create ticket in zoho-desk")
  }
})