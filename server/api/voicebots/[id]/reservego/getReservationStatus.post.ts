import { getReservegoApikeyAndRestaurantId } from "~/server/utils/db/reservego"
import { getReservationStatus } from "~/server/utils/reservego/module"

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, z.object({
    phoneNumber: z.string()
  }))

  const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const voicebotReservego = await getReservegoApikeyAndRestaurantId(botId, "voicebot")

  if(!voicebotReservego?.status) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: voicebotReservego?.message }),
    );
  }

  const restaurantId = voicebotReservego?.data?.restaurantId
  const apiKey = voicebotReservego?.data?.apiKey

  const data = await getReservationStatus({ restaurantId, apiKey }, body, "voicebot")

  if(!data.status) {
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage:
          "Internal Server Error: Unable to retrieve reservations. Please try again later.",
      }),
    );
  }
  return data
})