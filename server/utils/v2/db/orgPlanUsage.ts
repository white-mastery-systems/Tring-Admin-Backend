import { logger } from "~/server/logger"
import { getSubcriptionPlanDetailByPlanCode } from "../../db/pricing"
import { getOrgPlanUsage } from "./planUsage"
import momentTz from "moment-timezone"

const findUTCDate = (orgZohoSubscription: any) => {
  return {
    startDate: orgZohoSubscription?.startDate ?? momentTz().utc().toDate(),
    endDate: orgZohoSubscription.endDate ?? momentTz().utc().toDate(),
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

    const resObj = constructPlanUsageResponse({
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
    if(orgZohoSubscription?.pricingPlanCode === "voice_free" || orgZohoSubscription?.subscriptionStatus === "cancelled") {
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
    
    const resObj = constructPlanUsageResponse({
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
    return resObj
  } catch (error: any) {
    logger.error(`Voice plan usage Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
} 

export const orgUsage = async (organizationId: string, timezone: string, serviceType: string, country: string) => {
  try {
    const [orgDetail, orgZohoSubscription, adminDetail] = await Promise.all([
      getOrganizationById(organizationId),
      getOrgZohoSubscription(organizationId, serviceType),
      getAdminByOrgId(organizationId)
    ])
    
    const { startDate, endDate } = findUTCDate(orgZohoSubscription)
    const adminCountry = adminDetail?.address?.country! || country

    const planPricingDetail = await getSubcriptionPlanDetailByPlanCode(orgZohoSubscription?.pricingPlanCode!, adminCountry)

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
    subscription_status: subscriptionStatus ?? orgZohoSubscription?.subscriptionStatus
  };
}
