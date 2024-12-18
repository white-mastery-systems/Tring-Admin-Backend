import momentTz from "moment-timezone";
import { billingLogger, logger } from "~/server/logger";
import { runHostedPageApi } from "~/server/utils/zoho/subscription";

const db = useDrizzle();

interface zohoConfigInterface {
  metaData: {
    client_id: string;
    client_secret: string;
    refresh_token: string;
    access_token: string;
    organization_id: string;
    code: string;
  };
}


export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader)
  ? timeZoneHeader[0]
  : timeZoneHeader || "Asia/Kolkata";
  const body = await readBody(event);
  billingLogger.info(`${body.type}---${JSON.stringify(body)}`);
  const query = await isValidQueryHandler(event, z.object({
    type: z.string()
  }))
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string;
    const getOrgCurrentActivePlan = await db.query.orgSubscriptionSchema.findFirst({
      where: and(
        eq(orgSubscriptionSchema.organizationId, organizationId),
        eq(orgSubscriptionSchema.botType, query.type)
      )
    })
    if(getOrgCurrentActivePlan?.planCode !== "chat_free" && getOrgCurrentActivePlan?.planCode !== "voice_free" && getOrgCurrentActivePlan?.status !== "cancelled") {
      const expiryDate = momentTz(getOrgCurrentActivePlan?.expiryDate).tz(timeZone).toDate();
      const currentDate =  momentTz().tz(timeZone).toDate();
      if(currentDate < expiryDate) {
        return sendError(
          event,
          createError({ statusCode: 400, statusMessage: "You can't upgrade or downgrade plan" }),
        );
      }
    }
    const zohoData: any = await db.query.adminConfigurationSchema.findFirst({
      where: eq(adminConfigurationSchema.id, 1),
    });
    let metaData = {
      ...zohoData.metaData,
    };
    const user: any = event.context.user;
    if (!user) {
      return sendError(
        event,
        createError({ statusCode: 404, statusMessage: "Invalid User" }),
      );
    }
    const userDetails: any = await db.query.authUserSchema.findFirst({
      where: eq(authUserSchema.id, user?.id),
    });
  
    const orgDetails: any = await db.query.organizationSchema.findFirst({
      where: eq(organizationSchema.id, organizationId),
    });

    if (orgDetails?.planCode) {
      const planDetails = await db.query.adminPricingSchema.findFirst({
        where: eq(adminPricingSchema.planCode, body?.plan),
      });

      const data = await runHostedPageApi({
       accessToken: metaData.access_token, user, organizationId, userDetails, orgDetails, body, metaData, zohoData
      });
      return data
    }
  } catch (err: any) {
    console.log({ err });
    logger.error(`Error creating hosted page: ${err.message} ${JSON.stringify(err?.data)} ${JSON.stringify(err)} `);
    if (err instanceof Error) {
    }
  }

  return { success: "true" };
});
