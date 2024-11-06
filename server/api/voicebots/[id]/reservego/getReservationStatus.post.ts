import { getReservationStatus } from "~/server/utils/reservego/module"

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, z.object({
    phoneNumber: z.string()
  }))

  const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const botDetails: any = await getVoicebot(botId)

  const botIntegrationList: any = await listVoiceBotIntegrations(botDetails?.organizationId, botId)

  const reservegoCrm = botIntegrationList.find((i: any)=> i.integration.crm  === "reserve-go")

  if(!reservegoCrm) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "This bot is not integrated with reserve-go" }),
    );
  }

  const restaurantId = reservegoCrm?.metadata?.restaurantId
  const apiKey = reservegoCrm?.integration?.metadata?.apiKey

  if(!restaurantId) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Reserve-go restaurantId is missing" }),
    );
  }

  if(!apiKey) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Reserve-go apikey is missing" }),
    );
  }
  const data = await getReservationStatus({ restaurantId, apiKey }, body)

  if(!data.status) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: "Unable to get reservations" }),
    );
  }
  return data
})