
import { billingLogger, logger } from "~/server/logger";
import { updateChatbotStatus } from "~/server/utils/db/organization";
import { cancelSubscriptionFromZohoBilling } from "~/server/utils/zoho/modules";

const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const orgId = event.context.user?.organizationId;
  const query = await isValidQueryHandler(event, z.object({
    type: z.string()
  }))
  if (!orgId) {
    return createError({
      statusCode: 401,
      statusMessage:
        "Unauthorized: Organization ID is required to access this resource.",
    });
  }

  const orgSubscriptionData = await db.query.orgSubscriptionSchema.findFirst({  
    where: and(
      eq(orgSubscriptionSchema.organizationId, orgId),
      eq(orgSubscriptionSchema.botType, query.type)
    )
  })

  const paymentSubscriptionData: any = await db.query.paymentSchema.findFirst({
    where: and(
      eq(paymentSchema.status, "active"),
      eq(paymentSchema.organizationId, orgId),
      eq(paymentSchema.type, "subscription"),
    ),
  });

  const subscriptionDataFromZoho = await cancelSubscriptionFromZohoBilling({
    subscriptionId: orgSubscriptionData?.subscriptionId || paymentSubscriptionData.subscriptionId,
  });

  // const orgData = await db
  //   .update(organizationSchema)
  //   .set({ planCode: "chat_free" })
  //   .where(eq(organizationSchema.id, orgId));

  await Promise.all([
    db.update(orgSubscriptionSchema).set({
      status: "cancelled"
    }).where(and(
        eq(orgSubscriptionSchema.organizationId, orgId),
        eq(orgSubscriptionSchema.botType, query.type)
      )),
   updateChatbotStatus(orgId),
   db
    .update(paymentSchema)
    .set({
      status: "cancelled",
    })
    .where(
      and(
        eq(paymentSchema.organizationId, orgId),
        eq(paymentSchema.status, "active"),
        eq(paymentSchema.type, "subscription"),
      ),
    )
  ])
  billingLogger.info(`Zoho subscription cancelled from tring admin panel`)
  
    return true
});
