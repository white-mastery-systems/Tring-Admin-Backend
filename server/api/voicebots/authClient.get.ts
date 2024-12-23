import momentTz from "moment-timezone"
import { error } from "winston";
import { errorResponse } from "~/server/response/error.response";
import { getCurrentMonthCallLogList } from "~/server/utils/db/call-logs";
import { orgVoicebotSubscription } from "~/server/utils/db/voicebots";

const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
  const query = await isValidQueryHandler(event, z.object({
    phoneNumber: z.any()
  }))
  
  const incomingPhoneNumber = (`+${query.phoneNumber}`).replace(/\s+/g, "")

  const voiceBotDetail: any = await db.query.voicebotSchema.findFirst({
    where: eq(voicebotSchema.incomingPhoneNumber, incomingPhoneNumber)
  })

  if (!voiceBotDetail) return errorResponse(event, 400, "Mobile number does not exist")

  const organizationId = voiceBotDetail?.organizationId

  if (!voiceBotDetail.active) return errorResponse(event, 400, "Bot is not active")

  // check the plan-code of the orgaination
  let voicebotPlan: any = await orgVoicebotSubscription(organizationId)
  
  const voicebotFreePlan = {
    organizationId,
    botType: "voice",
    planCode: "voice_free",
    status: "active"
  }

  if(!voicebotPlan) {
    voicebotPlan = (await db.insert(orgSubscriptionSchema).values(voicebotFreePlan).returning())[0]
  }

  // console.log({ voicebotPlan })
  if (voicebotPlan?.planCode === "voice_free") {
    return errorResponse(event, 500, "This user was a free plan")
  }

  if(voicebotPlan.status === "cancelled" || voicebotPlan.status === "inactive") {
    return errorResponse(event, 500, "Subscription status is inactive")
  }
  //TODO - add extra and normal quota validation
  
  // calculate total minutes for current month
  const currentDate = momentTz().tz(timeZone).toDate()
  const currentMonthStartDate = momentTz(voicebotPlan?.subscriptionCreatedDate).tz(timeZone).startOf("month").toDate()
  const currentMonthEndDate = momentTz(voicebotPlan?.expiryDate).tz(timeZone).endOf("month").toDate()
  
  const voicebotCallLogs = await getCurrentMonthCallLogList(organizationId, currentMonthStartDate, currentMonthEndDate)
  // return { voicebotCallLogs }

  // get actual voicebot pricing information
  const voicePricingInformation = await getPricingInformation(voicebotPlan?.planCode)

  const totalMinutes = voicebotCallLogs.reduce((acc, item) => acc + Math.round(item?.duration / 60), 0);

  // Convert total seconds to minutes
  const usedCallMinutes = totalMinutes
  const maxCallMinutes = voicePricingInformation?.sessions || 0

  if(usedCallMinutes > maxCallMinutes || currentDate > voicebotPlan.expiryDate) {
     await db.update(orgSubscriptionSchema)
     .set({ status: "inactive" })
     .where( and(
      eq(orgSubscriptionSchema.organizationId, organizationId)
     ))
     return errorResponse(event, 500, "Exceeded the allowed call minutes.")
  }
  
  return voiceBotDetail
});
