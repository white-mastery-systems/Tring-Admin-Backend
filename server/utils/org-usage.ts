import { getOrgAndSubscription, updateStatuses } from "./db/organization";
import momentTz from "moment-timezone";
import { getOrgTotalWhatsappSessionsForMonth } from "./db/whatsappSessions";

const handleChatTypeBilling = async (
  organizationId: string,
  timeZone: string,
  startDate: Date,
  endDate: Date,
  orgSubscription: any,
  gst: any,
  currentDate: Date,
  pricingInformation: any,
  type: string
) => {
   
    // get interacted chats 
    const interactedSessions = await getInteractedSessions(organizationId, startDate, endDate)
    const whatsapp = await getOrgTotalWhatsappSessionsForMonth(organizationId, startDate, endDate)

    const whatsappTotalSessions = whatsapp.length || 0
  
    const usedSessions = interactedSessions?.length + whatsappTotalSessions || 0;
    const maxSessions = pricingInformation.sessions
    const orgWalletSessions =  orgSubscription.walletSessions || 0
    const availableSessions = Math.max(maxSessions - usedSessions, 0)
    let extraSessions = 0

    if(orgSubscription?.status === "cancelled") {
      const resObj = constructResponse({
        usedQuota: 0,
        maxQuota: 0,
        planCode: "unAvailable",
        walletBalance: orgSubscription.walletSessions,
        extraSessionsCost: 0,
        gst,
        extraSessions: 0,
        availableSessions: 0,
        orgSubscription,
        subscriptionStatus: "cancelled",
        whatsappSession: whatsappTotalSessions || 0,
        whatsappWalletBalance: orgSubscription.whatsappWallet || 0
      })
      return resObj
    }
  
    const resObj = constructResponse({
      usedQuota: usedSessions,
      maxQuota: maxSessions,
      planCode: orgSubscription.planCode,
      walletBalance: orgWalletSessions,
      extraSessionsCost: pricingInformation.extraSessionCost,
      gst,
      extraSessions,
      availableSessions,
      orgSubscription,
      subscriptionStatus: orgSubscription.status,
      whatsappSession: whatsappTotalSessions || 0,
      whatsappWalletBalance: orgSubscription.whatsappWallet || 0
    });
  
    // Calculate expiry date and check if the subscription is expired
    const expiryDate = momentTz(orgSubscription?.expiryDate)
    .tz(timeZone)
    .toDate();
  
    if (currentDate > expiryDate) {
      const subscriptionStatus = "inactive";
      await updateStatuses(organizationId, subscriptionStatus, orgSubscription, type);
      return { ...resObj, subscription_status: subscriptionStatus };
    }
    
    if (usedSessions >= maxSessions) {
      extraSessions = Math.max(usedSessions - maxSessions, 0)
      const currentWallet = Math.max(orgWalletSessions - extraSessions, 0)
      resObj.wallet_balance = currentWallet
      resObj.extra_sessions = extraSessions
    }
  
    return resObj
};

const handleVoiceTypeBilling = async (
  organizationId: string,
  timeZone: string,
  startDate: Date,
  endDate: Date,
  orgSubscription: any,
  gst: any,
  currentDate: Date,
  pricingInformation: any,
  type: string
) => {
  if(orgSubscription?.planCode === "voice_free" || orgSubscription?.status === "cancelled") {
     const resObj = constructResponse({
      usedQuota: 0,
      maxQuota: 0,
      planCode: "unAvailable",
      walletBalance: orgSubscription.walletSessions,
      extraSessionsCost: 0,
      gst,
      extraSessions: 0,
      availableSessions: 0,
      orgSubscription,
      subscriptionStatus: orgSubscription?.status === "cancelled"? "cancelled" :"inactive"
    })
     return resObj
  }
  const voicebotCallLogs = await getCurrentMonthCallLogList(organizationId, startDate, endDate)
  
  const totalMinutes = voicebotCallLogs.reduce((acc, item) => acc + Math.round(item?.duration / 60), 0);
  
  // Convert total seconds to minutes
  const usedCallMinutes = totalMinutes
  const maxCallMinutes = pricingInformation.sessions
  const availableMinutes = Math.max(maxCallMinutes - usedCallMinutes, 0)
  const orgWalletMinutes =  orgSubscription.walletSessions || 0

  const extraMinutes = orgSubscription.extraSessions

  const resObj = constructResponse({
    usedQuota: usedCallMinutes,
    maxQuota: maxCallMinutes,
    planCode: orgSubscription.planCode,
    walletBalance: orgWalletMinutes,
    extraSessionsCost: pricingInformation.extraSessionCost,
    gst,
    extraSessions: extraMinutes,
    availableSessions: availableMinutes,
    orgSubscription,
    subscriptionStatus: orgSubscription.status
  })

  const expiryDate = momentTz(orgSubscription?.expiryDate)
    .tz(timeZone)
    .toDate();
  
  if (currentDate > expiryDate) {
    const subscriptionStatus = "inactive";
    await updateOrgSubscriptionStatus(organizationId, "inactive", "voice")
    return { ...resObj, subscription_status: subscriptionStatus };
  }

  if (usedCallMinutes >= maxCallMinutes) {
    resObj.wallet_balance = orgWalletMinutes
    resObj.extra_sessions = extraMinutes
  }
  return resObj
}

export const getOrgUsage = async (organizationId: string, timeZone: string, query: any) => {
  // Determine date range for the current month
  const currentDate = momentTz().tz(timeZone).toDate();

  const [org, orgSubscription] = await getOrgAndSubscription(organizationId, query);

  const { startDate, endDate } = calculateDateRange(orgSubscription, org, timeZone);
  // console.log({ startDate, endDate })

  if(!org) {
    throw new Error("organization not found")
  }
  const orgGst = org.metadata?.gst
  // get Pricing information
  const pricingInformation = await getPricingInformation(orgSubscription?.planCode!)

  if(query.type === "chat") {
      return handleChatTypeBilling(
        organizationId, 
        timeZone,
        startDate,
        endDate,
        orgSubscription,
        orgGst,
        currentDate,
        pricingInformation,
        query?.type
      )
  }
  if(query.type === "voice") {
      return handleVoiceTypeBilling(
        organizationId, 
        timeZone,
        startDate,
        endDate,
        orgSubscription,
        orgGst,
        currentDate,
        pricingInformation,
        query?.type
      )
  }
};

const constructResponse = ({ usedQuota, maxQuota, planCode, walletBalance, extraSessionsCost, gst, extraSessions,availableSessions,orgSubscription, subscriptionStatus, whatsappSession, whatsappWalletBalance } :
 { usedQuota: number,
  maxQuota: number,
  planCode: string,
  walletBalance: number,
  extraSessionsCost: number,
  gst: string,
  extraSessions: number,
  availableSessions: number,
  orgSubscription: any,
  subscriptionStatus: string,
  whatsappSession?: number,
  whatsappWalletBalance?: number
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
    expiry_date: orgSubscription?.status !== "cancelled" && orgSubscription?.expiryDate ? orgSubscription?.expiryDate : undefined,
    subscription_status: subscriptionStatus,
    whatsapp_sessions: whatsappSession ?? undefined,
    whatsapp_wallet_balance: whatsappWalletBalance ?? undefined
  };
};