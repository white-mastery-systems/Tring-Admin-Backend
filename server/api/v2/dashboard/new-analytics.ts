import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getNewAnalytics } from "~/server/utils/v2/db/analytics";
import { getOrgChatAndVoicebots } from "~/server/utils/v2/db/organization";

const queryValidator = z.object({
  period: z.string(),
  from: z
    .string()
    .datetime({ offset: true })
    .nullish()
    .transform((val) => (val ? new Date(val) : null)),
  to: z
    .string()
    .datetime({ offset: true })
    .nullish()
    .transform((val) => (val ? new Date(val) : null)),
  graphValues: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try{
    const timeZoneHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(timeZoneHeader)
      ? timeZoneHeader[0]
      : timeZoneHeader || "Asia/Kolkata";
    const organizationId = (await isOrganizationAdminHandler(event)) as string;

    const validatedQuery = await isValidQueryHandler(event, queryValidator);

    const botType = await getOrgChatAndVoicebots(organizationId);

    const data = await getNewAnalytics(
      organizationId,
      { ...validatedQuery, botType },
      timeZone,
    );

    return data;
  } catch (error: any) {
    logger.error(`Dashboard - Get Analytics API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch")
  }
})