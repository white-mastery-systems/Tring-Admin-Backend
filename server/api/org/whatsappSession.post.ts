import { logger } from "~/server/logger";
import countriesData from "~/assets/country-codes.json";
import { createOrgWhatsappSession, getOrgWhatsappSessions } from "~/server/utils/db/whatsappSessions";
import { updateSubscriptionPlanUsageById } from "~/server/utils/v2/db/planUsage";

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, z.object({
    organizationId: z.string(),
    pid: z.string(),
    mobile: z.string(),
    countryCode: z.string(),
    integrationId: z.string()
  }));

  try {
    const { organizationId, pid, mobile, countryCode } = body;

    logger.info(`Creating WhatsApp session for organization: ${organizationId}, pid: ${pid}, mobile: ${mobile}, countryCode: ${countryCode}`);

    const [orgZohoSubscription, orgDetail, orgPlanUsage, adminDetail] = await Promise.all([
      getOrgZohoSubscription(organizationId, "chat"),
      getOrganizationById(organizationId),
      getOrgPlanUsage(organizationId, "chat"),
      getAdminByOrgId(organizationId)
    ]);

    const adminCountry = adminDetail?.address?.country || "India";

    const planPricingDetail = await getSubcriptionPlanDetailByPlanCode(
      orgZohoSubscription?.pricingPlanCode!,
      adminCountry
    );

    const isSubscriptionActive = orgZohoSubscription?.subscriptionStatus === "active";
    let whatsappWalletBalance = orgDetail?.wallet || 0;
    const reduceAmount = countriesData.find(
      (item) => item.dial_code === countryCode
    )?.WhatsappSessionCost || 1.5;

    // Check if session already exists within 2 hours
    const existingSession = await getOrgWhatsappSessions(organizationId, pid, mobile);

    const now = new Date();
    let shouldCreateNewSession = false;

    if (existingSession) {
      const createdAt = new Date(existingSession.createdAt);
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      if (hoursDiff > 2) {
        shouldCreateNewSession = true;
      }
    } else {
      shouldCreateNewSession = true;
    }

    const isRevisited = !!existingSession && shouldCreateNewSession;

    if (shouldCreateNewSession) {
      // Check subscription
      if (!isSubscriptionActive) {
        return {
          status: false,
          whatsappWalletBalance,
          organizationName: orgDetail?.name,
          revisited: isRevisited,
          subscriptionStatus: false
        };
      }

      const usedSessions = (orgPlanUsage?.interactionsUsed || 0) + 1;
      const maxSessions = planPricingDetail?.sessions || 0;
      const isExtraSession = usedSessions > maxSessions;
      const sessionCost = isExtraSession
        ? planPricingDetail?.extraSessionCost ?? reduceAmount
        : reduceAmount;

      if (whatsappWalletBalance < sessionCost) {
        return {
          status: false,
          whatsappWalletBalance,
          organizationName: orgDetail?.name,
          revisited: isRevisited,
          subscriptionStatus: true
        };
      }

      // Deduct wallet, create session
      const totalExtraSessions = isExtraSession
        ? (orgPlanUsage?.extraInteractionsUsed || 0) + 1
        : orgPlanUsage?.extraInteractionsUsed || 0;

      whatsappWalletBalance = parseFloat((whatsappWalletBalance - sessionCost).toFixed(2));

      const createNewWhatsappSession = await createOrgWhatsappSession(body)

      await Promise.all([
        updateOrganization(organizationId, { wallet: whatsappWalletBalance }),
        updateSubscriptionPlanUsageById(orgPlanUsage?.id!, {
          interactionsUsed: usedSessions,
          extraInteractionsUsed: totalExtraSessions
        })
      ]);

      return {
        sessionId: createNewWhatsappSession.id,
        leadStatus: createNewWhatsappSession?.leadStatus,
        status: true,
        whatsappWalletBalance,
        organizationName: orgDetail?.name,
        revisited: isRevisited,
        subscriptionStatus: true
      };
    }

    // Session still valid, no wallet deduction
    return {
      sessionId: existingSession?.id,
      leadStatus: existingSession?.leadStatus,
      status: true,
      whatsappWalletBalance,
      organizationName: orgDetail?.name,
      revisited: false,
      subscriptionStatus: true
    };

  } catch (error: any) {
    logger.error(`Whatsapp Session Error: ${error?.message}`);
    return { status: false, revisited: false };
  }
});
