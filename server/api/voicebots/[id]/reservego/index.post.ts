import api from "~/server/api"
import { createNewReservation } from "~/server/utils/reservego/module"

const zodReservegoValidation = z.object({
  guestName: z.string(),
  guestPhone: z.string(),
  guestCount: z.number(),
  bookingTime: z
    .string()
    .datetime({ offset: true })
    .nullish()
    .transform((val) => (val ? new Date(val) : null)),
  generatedTime: z
    .string()
    .datetime({ offset: true })
    .nullish()
    .transform((val) => (val ? new Date(val) : null)),
  source: z.number(),
  status: z.number(),
  guestComments: z.string().optional(),
  guestEmail: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, zodReservegoValidation)

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
      createError({ statusCode: 400, statusMessage: "Reserve-go restaurantId is missing in integration-data" }),
    );
  }
  
  if(!apiKey) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Reserve-go apikey is missing in integration-data" }),
    );
  }
  
  const data = await createNewReservation({ restaurantId, apiKey }, body)
  if(!data.status) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: "Unable to create reservation" }),
    );
  }
  return data
})