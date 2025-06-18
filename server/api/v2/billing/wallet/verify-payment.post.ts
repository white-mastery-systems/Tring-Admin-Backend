import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getRazorpayPaymentDetailByPaymentId } from "~/server/utils/v2/billing/wallet"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string

    const body = await isValidBodyHandler(event, z.object({
      paymentId: z.string()
    }))
  
    const data: any = await getRazorpayPaymentDetailByPaymentId(body?.paymentId)

    if(data?.status !== "captured") {
      return errorResponse(event, 500, "Payment Verification Failed")
    }
    const creditAmount = data?.amount / 100

    const organizationDetail = await getOrganizationById(organizationId)

    const existingCreditsAmount = organizationDetail?.wallet || 0

    await updateOrganization(organizationId, { wallet: existingCreditsAmount + creditAmount })

    return { status: "Credits payment verification Successful" }
  } catch (error: any) {
    logger.error(`Credits verify payment API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to verify the credits payment")
  }
})