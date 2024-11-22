import { getReservegoApikeyAndRestaurantId } from "~/server/utils/db/reservego"
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

  const chatbotReservego = await getReservegoApikeyAndRestaurantId(botId, "chatbot")

  if(!chatbotReservego?.status) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: chatbotReservego?.message }),
    );
  }

  const restaurantId = chatbotReservego?.data?.restaurantId
  const apiKey = chatbotReservego?.data?.apiKey

  const data = await createNewReservation({ restaurantId, apiKey }, body,  "chatbot")
  if(!data.status) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: "Unable to create reservation" }),
    );
  }
  return data
})