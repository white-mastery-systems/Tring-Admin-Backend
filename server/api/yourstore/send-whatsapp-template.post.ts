import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { sendYoustoreAbandonedCartNotification } from "~/server/utils/whatsapp/module"

const zodAbandonedCart = z.object({
  templateName: z.string(),
  name: z.string(),
  mobile: z.string(),
  businessPhoneId: z.string(),
  imageLink: z.string().optional()
})

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getHeader(event, "access-token")
    if(!accessToken) {
       return errorResponse(event, 400, "Invalid Access-token")
    }

    const body = await isValidBodyHandler(event, zodAbandonedCart)
    logger.info(`Youstore - Abandoned Cart Notification Payload: ${JSON.stringify(body)}, Access-Token: ${accessToken}`)

    const data = await sendYoustoreAbandonedCartNotification({
      payload: {
        ...body,
        pid: body.businessPhoneId
      },
      accessToken
    })
    logger.info(`Yourstore Abandoned Cart Whatsapp Template Sent Successfully`)

    return data

  } catch (error: any) {
    logger.info(`Yourstore Send Whatsapp Template API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, error.message)
  }
})