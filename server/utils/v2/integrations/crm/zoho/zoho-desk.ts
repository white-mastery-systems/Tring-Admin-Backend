import { logger } from "~/server/logger";

export const getZohoDeskApiKey = async ({ botId, type } : { botId: string, type: string}) => {
  let botDetails: any
  let botIntegrationList: any 
  if(type === "chat") {
    botDetails = await getBotDetails(botId);
    botIntegrationList = await listBotIntegrations(botId)
  } else {
    botDetails = await getVoicebot(botId)
    botIntegrationList = await listVoiceBotIntegrations(botDetails?.organizationId, botId)
  }

  const zohoDeskCrm = botIntegrationList.find((i: any)=> i.integration.crm  === "zoho-desk")

  if(!zohoDeskCrm) {
    return { status: false, message: "This bot is not integrated with zoho-desk"}
  }

  const accessToken = zohoDeskCrm?.integration?.metadata?.access_token

  if(!accessToken) {
    return { status: false, message: "Zoho-desk access token is missing in integration-data"}
  }

  return { status: true, data: { integrationData: zohoDeskCrm.integration } }
}

export const createTicketInZohoDesk: any = async ({ integrationData, body } : { integrationData: any, body: any }) => {
  try {
    const payload = {
        subject: body?.subject,
        departmentId: body?.departmentId,
        phone: body?.phone,
        email: body?.email,
        contact: {
          lastName: body?.firstName
        },
        description: body?.description,
        priority: body?.priority,
        category: body?.category,
        classification: body?.classification,
        status: "open"
      }

    const response = await $fetch(`https://desk.zoho.in/api/v1/tickets`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${integrationData?.metadata?.access_token}`
      },
      body: payload
    })
    if(!response) {
      return { status: false }
    }
    return { status: true }
  } catch (error: any) {
    logger.error(`Create ticket in zoho desk function Error: ${JSON.stringify(error.message)}`)
    if (error.status === 401) {
      const regenerateAccessToken = await regenearateTokenWithRefreshTokenForZohoIntegration({ integrationData })
      return createTicketInZohoDesk({ integrationData: regenerateAccessToken , body })
    }
    throw new Error(error)
  }
}