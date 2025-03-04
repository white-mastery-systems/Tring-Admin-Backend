import { orgUsage } from "~/server/utils/v2/db/orgPlanUsage";
import { getOrgUsage } from "../../utils/org-usage";

export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader)
    ? timeZoneHeader[0]
    : timeZoneHeader || "Asia/Kolkata";
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const query = await isValidQueryHandler(event, z.object({
    type: z.string(),
    country: z.string().optional()
  }))

  const userCountry = query.country || "India"
  
  const usage = await orgUsage(organizationId, timeZone, query.type, userCountry);

  return usage;
});
