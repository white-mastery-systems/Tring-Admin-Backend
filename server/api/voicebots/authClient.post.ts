import momentTz from "moment-timezone"
import { getCurrentMonthCallLogList } from "~/server/utils/db/call-logs";
import { orgVoicebotSubscription } from "~/server/utils/db/voicebots";

const db = useDrizzle();


export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
  const body = await readValidatedBody(
    event,
    z.object({
      mobile: z.string(),
      countryCode: z.string(),
    }).parse,
  );

  // console.log({ body })
  // console.log({ moment: momentTz.tz.zonesForCountry("IN")})

  const numberIntegrationDetail: any = await db.query.numberIntegrationSchema.findFirst({
    where: eq(numberIntegrationSchema.exoPhone, body?.mobile),
  });

  if (!numberIntegrationDetail) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Mobile number does not exist",
      }),
    );
  }

  const integrationId = numberIntegrationDetail?.id
  
  const voiceBotDetail: any = await db.query.voicebotSchema.findFirst({
    where: eq(voicebotSchema.ivrConfig, integrationId)
  })
  const organizationId = voiceBotDetail?.organizationId

  if (!voiceBotDetail.active) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Bot is not active",
      }),
    );
  }

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
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "This user was a free plan",
      }),
    );
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
     return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Exceeded the allowed call minutes.",
      }),
    );
  }
  
  return voiceBotDetail
});
