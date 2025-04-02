import { logger } from "~/server/logger"
import { getSubcriptionPlanDetailByPlanCode } from "../../db/pricing"
import { getOrgPlanUsage } from "./planUsage"
import momentTz from "moment-timezone"

const findUTCDate = (orgZohoSubscription: any, orgDetail: any) => {
  let startDate: Date
  let endDate: Date
  if(orgZohoSubscription.pricingPlanCode === "chat_free" || orgZohoSubscription.pricingPlanCode === "voice_free") {
    startDate = orgDetail?.createdAt
    endDate = momentTz().utc().toDate()
  } else {
    startDate = orgZohoSubscription?.startDate
    endDate = orgZohoSubscription.endDate
  }
  return {
    startDate,
    endDate
  };
}

export const chatPlanUsages = async (orgZohoSubscription: any, orgDetail: any, planPricingDetail: any, startDate: Date, endDate: Date) => {
  try {
    const whatsapp = await getOrgTotalWhatsappSessionsForMonth(orgDetail?.id, startDate, endDate)
    const whatsappTotalSessions = whatsapp.length
  
    const wallet = orgDetail?.wallet
    const gst = orgDetail?.metaData?.gst
    
    if(orgZohoSubscription?.subscriptionStatus === "cancelled") {
      const resObj = constructPlanUsageResponse({
        usedQuota: 0,
        maxQuota: 0,
        planCode: "unAvailable",
        walletBalance: wallet,
        extraSessionsCost: 0,
        gst,
        extraSessions: 0,
        availableSessions: 0,
        orgZohoSubscription,
        whatsappSession: whatsappTotalSessions || 0,
      })
      return resObj
    }
    const orgChatPlanUsage = await getOrgPlanUsage(orgDetail?.id, orgZohoSubscription?.serviceType)

    const usedSessions = orgChatPlanUsage?.interactionsUsed || 0
    const maxSessions = planPricingDetail?.sessions || 0
    const availableSessions = Math.max(maxSessions - usedSessions, 0)

    const resObj: any = constructPlanUsageResponse({
      usedQuota: usedSessions,
      maxQuota: maxSessions,
      planCode: orgZohoSubscription.pricingPlanCode,
      walletBalance: wallet,
      extraSessionsCost: planPricingDetail.extraSessionCost,
      gst,
      extraSessions: orgChatPlanUsage?.extraInteractionsUsed || 0,
      availableSessions,
      orgZohoSubscription,
      whatsappSession: whatsappTotalSessions || 0
    });
    if(orgZohoSubscription.subscriptionStatus ===  "trial") {
      const trialEndDate = momentTz(orgZohoSubscription.endDate, "YYYY-MM-DD").startOf("day");
      const currentDate = momentTz().startOf('day');
      const daysRemaining = trialEndDate.diff(currentDate, "days");
      resObj.remainingDaysForTrialEnd = daysRemaining
    }

    return resObj
  } catch (error: any) {
    logger.error(`Chat plan usage Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const voicePlanUsages = async (orgZohoSubscription: any, orgDetail: any, planPricingDetail: any) => {
  try {
    const wallet = orgDetail?.wallet
    const gst = orgDetail?.metadata?.gst
    if(orgZohoSubscription?.subscriptionStatus === "cancelled") {
      const resObj = constructPlanUsageResponse({
        usedQuota: 0,
        maxQuota: 0,
        planCode: "unAvailable",
        walletBalance: wallet,
        extraSessionsCost: 0,
        gst,
        extraSessions: 0,
        availableSessions: 0,
        orgZohoSubscription,
        subscriptionStatus: orgZohoSubscription?.subscriptionStatus === "cancelled"? "cancelled" : "inactive"
      })
      return resObj
    }
    const orgVoicePlanUsage = await getOrgPlanUsage(orgDetail?.id, "voice")

    const usedCallMinutes = orgVoicePlanUsage?.interactionsUsed || 0
    const maxCallMinutes = planPricingDetail.sessions
    const availableMinutes = Math.max(maxCallMinutes - usedCallMinutes, 0)
    
    const resObj: any = constructPlanUsageResponse({
      usedQuota: usedCallMinutes,
      maxQuota: maxCallMinutes,
      planCode: orgZohoSubscription.pricingPlanCode,
      walletBalance: wallet,
      extraSessionsCost: planPricingDetail.extraSessionCost,
      gst,
      extraSessions: orgVoicePlanUsage?.extraInteractionsUsed || 0,
      availableSessions: availableMinutes,
      orgZohoSubscription,
      subscriptionStatus: orgZohoSubscription.subscriptionStatus
    })
    if(orgZohoSubscription.subscriptionStatus ===  "trial") {
      const trialEndDate = momentTz(orgZohoSubscription.endDate, "YYYY-MM-DD").startOf("day");
      const currentDate = momentTz().startOf('day');
      const daysRemaining = trialEndDate.diff(currentDate, "days");
      resObj.remainingDaysForTrialEnd = daysRemaining
    }
    return resObj
  } catch (error: any) {
    logger.error(`Voice plan usage Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
} 

export const orgUsage = async (organizationId: string, timezone: string, serviceType: string, country: string) => {
  try {
    const [orgDetail, orgZohoSubscription, adminDetail, orgPlanUsage] = await Promise.all([
      getOrganizationById(organizationId),
      getOrgZohoSubscription(organizationId, serviceType),
      getAdminByOrgId(organizationId),
      getOrgPlanUsage(organizationId, serviceType)
    ])
    
    const { startDate, endDate } = findUTCDate(orgZohoSubscription, orgDetail)
    const adminCountry = adminDetail?.address?.country! || country
    let remainingDaysForTrialEnd = 0

    let planPricingDetail
    
    if(orgZohoSubscription?.pricingPlanCode === "chat_free" || orgZohoSubscription?.pricingPlanCode === "voice_free") {
      planPricingDetail = await getPricingInformation(serviceType === "chat" ? "chat_free" : "voice_free")
    } else if (orgZohoSubscription?.subscriptionStatus ===  "trial" || orgPlanUsage?.originalSubscriptionStatus === "trial") {
      planPricingDetail = serviceType === "chat" 
          ? await getSubcriptionPlanDetailByPlanCode("chat_intelligence", adminCountry)
          : await getPricingInformation("voice_free")
    } else {
      planPricingDetail = await getSubcriptionPlanDetailByPlanCode(orgZohoSubscription?.pricingPlanCode!, adminCountry)
    }

    if(serviceType === "chat") {
      return chatPlanUsages(
        orgZohoSubscription,
        orgDetail,
        planPricingDetail,
        startDate,
        endDate
      )
    }
    
    if(serviceType === "voice") {
      return voicePlanUsages(
        orgZohoSubscription,
        orgDetail,
        planPricingDetail,
      )
    }
  
  } catch (error: any) {
    logger.error(`Organization plan_usage function Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

const constructPlanUsageResponse = ({ usedQuota, maxQuota, planCode, walletBalance, extraSessionsCost, gst, extraSessions,availableSessions,orgZohoSubscription, whatsappSession, subscriptionStatus } :
 { 
  usedQuota: number,
  maxQuota: number,
  planCode: string,
  walletBalance: number,
  extraSessionsCost: number,
  gst: string,
  extraSessions: number,
  availableSessions: number,
  orgZohoSubscription: any,
  whatsappSession?: number,
  subscriptionStatus?: string
}) => {
  return {
    used_quota: usedQuota,
    max_quota: maxQuota,
    plan_code: planCode,
    wallet_balance: walletBalance,
    extra_sessions_cost: extraSessionsCost,
    gst,
    extra_sessions: extraSessions,
    available_sessions: availableSessions,
    expiry_date: orgZohoSubscription?.subscriptionStatus !== "cancelled" && orgZohoSubscription?.endDate ? orgZohoSubscription?.endDate : undefined,
    whatsapp_sessions: whatsappSession ?? undefined,
    subscription_status: planCode === "chat_free" || planCode  === "voice-free" ? "trial" : orgZohoSubscription?.subscriptionStatus
  };
}
