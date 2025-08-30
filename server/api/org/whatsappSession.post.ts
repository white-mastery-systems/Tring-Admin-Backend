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

    logger.info(
      `WhatsApp session for organization: ${organizationId}, pid: ${pid}, mobile: ${mobile}, countryCode: ${countryCode}`
    );

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

    // --- Common helper to handle subscription + charging + updating ---
    async function handleCharge(sessionId?: string) {
      if (!isSubscriptionActive) {
        return { blockedBySubscription: true };
      }

      const usedSessions = (orgPlanUsage?.interactionsUsed || 0) + 1;
      const maxSessions = planPricingDetail?.sessions || 0;
      const isExtraSession = usedSessions > maxSessions;
      const sessionCost = isExtraSession
        ? planPricingDetail?.extraSessionCost ?? reduceAmount
        : reduceAmount;
      logger.info(`Session cost calculated: ${sessionCost}, usedSessions: ${usedSessions}, maxSessions: ${maxSessions}, isExtraSession: ${isExtraSession}`);
      if (whatsappWalletBalance < sessionCost) {
        return { insufficientBalance: true };
      }

      whatsappWalletBalance = parseFloat(
        (whatsappWalletBalance - sessionCost).toFixed(2)
      );
      logger.info(`Wallet balance after deduction for whatsapp session: ${whatsappWalletBalance}`);
      const totalExtraSessions = isExtraSession
        ? (orgPlanUsage?.extraInteractionsUsed || 0) + 1
        : orgPlanUsage?.extraInteractionsUsed || 0;

      await Promise.all([
        updateOrganization(organizationId, { wallet: whatsappWalletBalance }),
        updateSubscriptionPlanUsageById(orgPlanUsage?.id!, {
          interactionsUsed: usedSessions,
          extraInteractionsUsed: totalExtraSessions
        }),
        sessionId
          ? updateWhatsappSessionById(sessionId, { isPriceCharged: true })
          : Promise.resolve()
      ]);

      return { blockedBySubscription: false, insufficientBalance: false, whatsappWalletBalance };
    }

    // --- Main session logic ---
    const existingSession = await getOrgWhatsappSessions(organizationId, pid, mobile);
    const now = new Date();
    let shouldCreateNewSession = false;

    if (existingSession) {
      const createdAt = new Date(existingSession.createdAt);
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      if (hoursDiff > 2) {
        logger.info(`Existing session expired (>${hoursDiff} hrs): ${existingSession.id} creating new session`);
        shouldCreateNewSession = true;
      } else if (!existingSession.isPriceCharged) {
        logger.info(`Charging for existing uncharged session: ${existingSession.id}`);
        // Charge existing uncharged session
        const result = await handleCharge(existingSession.id);

        if (result.blockedBySubscription) {
          return {
            status: false,
            whatsappWalletBalance,
            organizationName: orgDetail?.name,
            revisited: false,
            subscriptionStatus: false
          };
        }
        if (result.insufficientBalance) {
          return {
            status: false,
            whatsappWalletBalance,
            organizationName: orgDetail?.name,
            revisited: false,
            subscriptionStatus: true
          };
        }

        return {
          sessionId: existingSession.id,
          leadStatus: existingSession.leadStatus,
          status: true,
          whatsappWalletBalance: result.whatsappWalletBalance,
          organizationName: orgDetail?.name,
          revisited: false,
          subscriptionStatus: true
        };
      }
      logger.info(`Existing session still valid and charged: ${existingSession.id}`);
    } else {
      logger.info(`No existing session found, creating new session`);
      shouldCreateNewSession = true;
    }

    const isRevisited = !!existingSession && shouldCreateNewSession;

    if (shouldCreateNewSession) {
      logger.info(`Creating new session for pid: ${pid}, mobile: ${mobile}`);
      const result = await handleCharge(); // no sessionId yet

      if (result.blockedBySubscription) {
        return {
          status: false,
          whatsappWalletBalance,
          organizationName: orgDetail?.name,
          revisited: isRevisited,
          subscriptionStatus: false
        };
      }
      if (result.insufficientBalance) {
        return {
          status: false,
          whatsappWalletBalance,
          organizationName: orgDetail?.name,
          revisited: isRevisited,
          subscriptionStatus: true
        };
      }

      const createNewWhatsappSession = await createOrgWhatsappSession(body);

      return {
        sessionId: createNewWhatsappSession.id,
        leadStatus: createNewWhatsappSession?.leadStatus,
        status: true,
        whatsappWalletBalance: result.whatsappWalletBalance,
        organizationName: orgDetail?.name,
        revisited: isRevisited,
        subscriptionStatus: true
      };
    }

    // Session still valid, already charged → no wallet deduction
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
