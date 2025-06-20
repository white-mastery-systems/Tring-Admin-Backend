import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";

const db = useDrizzle();

export const intentDescriptions: Record<string, string> = {
  schedule_call: "Asks about scheduling a call, expresses interest in setting up a phone call, or indicates a desire to communicate via call.",
  site_visit: "Inquires about or expresses interest in visiting a physical site, mentions a site visit, or wants to arrange a visit to the location.",
  schedule_appointment: "Wants to book, schedule, or inquire about setting up an appointment for a service, meeting, or consultation."
};

export const getChatSubscriptionPlanCode = async (orgChatSubscription: any) =>{
  let planPricingDetail
  
  if(orgChatSubscription?.pricingPlanCode === "chat_free") {
    planPricingDetail = await getPricingInformation("chat_free")
  } else if (orgChatSubscription?.subscriptionStatus ===  "trial") {
    planPricingDetail = await getPricingInformation("chat_intelligence")
  } else {
    planPricingDetail = await getPricingInformation(orgChatSubscription?.pricingPlanCode!)
  }

  return planPricingDetail
}

export const handleChatBotLimitExceeded = async (orgDetail: any, pricing: any, count: number, limit: number, event: any) => {
  if (orgDetail?.wallet > 0) {
    const extraUsed = count - limit;
    const extraAllowed = Number(pricing?.extraBotLimit);
    if (extraUsed >= extraAllowed) {
      throw errorResponse(event, 400, `You can create only ${extraAllowed} extra chatbots for this plan`);
    }

    const cost = pricing?.extraBotCost || 0;
    if (orgDetail?.wallet >= cost) {
      const remaining = Math.max(0, parseFloat(((orgDetail.wallet || 0) - cost).toFixed(2)));
      await updateOrganization(orgDetail.id, { wallet: remaining });
    } else {
      throw errorResponse(event, 400, "Insufficient wallet balance to create an additional chatbot.");
    }
  } else {
    throw errorResponse(event, 400, `You can create only ${limit} ${limit > 1 ? "chatbots" : "chatbot"} for this plan`);
  }
}

export const getChatBotDefaultConfigs = async (industryDetail: any) => {
  let defaultIntents: string, defaultNotes: string = "";
  let defaultformStructure : any
  let defaultFormIntentName: string

  const industryName = industryDetail?.industryName

  if(industryDetail?.isDefault) {
    defaultNotes = chatIndustryDefaultNotes[industryName as keyof typeof chatIndustryDefaultNotes]?.note;
    defaultformStructure = chatDynamicFormValues[industryName as keyof typeof chatDynamicFormValues];
    defaultFormIntentName = Object.keys(defaultformStructure)[0]
  } else {
    const customIndustrySuggestions = await getCustomIndustrySuggestions(industryName)
    defaultFormIntentName = Object.keys(customIndustrySuggestions.custom)[0]
    defaultformStructure = {
      [defaultFormIntentName]: customIndustrySuggestions.custom[defaultFormIntentName]
    }
  }
  defaultIntents = `other\nsite_visit\nschedule_call\nschedule_appointment\n${defaultFormIntentName}`

  return {
    defaultIntents,
    defaultNotes,
    defaultformStructure,
    defaultFormIntentName
  }
}

export const createChatBotDefaultIntents = async (defaultIntents: string, defaultFormIntentName: string, defaultformStructure: any, botId: string, organizationId: string) => {
  try {
    const splitIntents = defaultIntents.split("\n").filter((intent) =>
    ["schedule_call", "schedule_appointment", "site_visit"].includes(intent)
    );

    const intentData = splitIntents.map((intent) => ({
      type: "schedule_form",
      intent,
      metadata: {
        traditionalForm: true,
        naturalConversation: false
      },
      description: intentDescriptions[intent] || "",
      botId,
      organizationId,
    }));

    intentData.push({
      type: "custom",
      intent: defaultFormIntentName,
      metadata: {
        ...defaultformStructure
      },
      description: "",
      botId,
      organizationId,
    });

    await createBotIntent(intentData);
  } catch (error: any) {
    logger.error(`Chatbot Default intent Creation Error: ${JSON.stringify(error.message)}`)
  }
}

export const getOrgTotalChatBotsForAnalytics = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined, active?: boolean) => {
  return await db
  .select({ createdAt: chatBotSchema.createdAt })
  .from(chatBotSchema)
  .where(
    and(
      ...(fromDate && toDate ? [
        gte(chatBotSchema.createdAt, fromDate),
        lte(chatBotSchema.createdAt, toDate),
      ] : []),
      (active ? active === true ? isNotNull(chatBotSchema.documentId) : isNull(chatBotSchema.documentId): undefined),
      eq(chatBotSchema.organizationId, organizationId),
      eq(chatBotSchema.isDeleted, false)
    ),
  )
}

export const getOrgChatBotsByFilterForAnalytics = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined, active?: boolean) => {
  return await db
  .select({ createdAt: chatBotSchema.createdAt })
  .from(chatBotSchema)
  .where(
    and(
      ...(fromDate && toDate ? [
        gte(chatBotSchema.createdAt, fromDate),
        lte(chatBotSchema.createdAt, toDate),
      ] : []),
      (active === true ? isNotNull(chatBotSchema.documentId) : isNull(chatBotSchema.documentId)),
      eq(chatBotSchema.organizationId, organizationId),
      eq(chatBotSchema.isDeleted, false)
    ),
  )
}


export const getWhatsappIntegratedChatbots = async (organizationId: string) => {
  return await db.query.chatBotSchema.findMany({
    where: and(
      eq(chatBotSchema.organizationId, organizationId),
      eq(chatBotSchema.status, "active"),
      eq(chatBotSchema.isDeleted, false),
      isNotNull(chatBotSchema.documentId),  
      sql`channels ->> 'whatsapp' IS NOT NULL AND channels ->> 'whatsapp' != '' AND jsonb_typeof(channels -> 'whatsapp') = 'string'`
    ),
    columns: {
      id: true,
      name: true,
      channels: true
    }
  })
}