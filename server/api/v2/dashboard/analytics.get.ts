import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

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

    const data = await getOrgAnalytics(
      organizationId,
      validatedQuery,
      timeZone,
    );

    return data;
  } catch (error: any) {
    logger.error(`Dashboard - Analytics API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch")
  }
})