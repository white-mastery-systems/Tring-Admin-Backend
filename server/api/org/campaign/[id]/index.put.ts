import { errorResponse } from "~/server/response/error.response"

const zodUpdateCampaign = z.object({
  campaignName: z.string().optional(),
  contactMethod: z.string().optional(),
  bucketId: z.string().optional(),
  botConfig: z.object({
    botId: z.string().optional(),
    workingStartTime: z.string().optional(),
    workingEndTime: z.string().optional(),
    callsPerTrigger: z.string().optional(),
    date: z.string().optional(),
    scheduleTime: z.string().optional(),
    templateId: z.string().optional()
  })
})

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event) as string

  const { id: campaignId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body: any = await isValidBodyHandler(event, zodUpdateCampaign)

  const isAlreadyExist = await checkCampaignNameExist(organizationId, body?.campaignName, campaignId)
  
  if(isAlreadyExist) return errorResponse(event, 400, "Campaign name already exists")
   
  const data = await updateCampaign(campaignId, body)

  return data
})