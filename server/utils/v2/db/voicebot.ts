import { InsertVoicebotCallSchedule, InsertVoiceResponseImprovement, voicebotCallScheduleSchema } from "~/server/schema/voicebot"
import momentTz from "moment-timezone"
import { inArray } from "drizzle-orm"

const db = useDrizzle()
const config = useRuntimeConfig()

export const voicebotKnowledgeSource = async (knowledgeSource: string, websiteContent: string, textContent: string, documentId: string) => {
  let knowledgeBase: string = "";
  switch (knowledgeSource) {
    case "website":
      knowledgeBase = websiteContent ?? "";
      break;
    case "text":
      knowledgeBase = textContent ?? "";
      break;
    case "document":
      if (documentId) {
        const document = await getVoicebotDocumentById(documentId);
        knowledgeBase = document?.documentContent ?? "";
      }
      break;
  }
  return knowledgeBase
}

export const zodCreateNewVoicebotSchema = z.object({
  name: z.string(),
  active: z.boolean().optional(),
  industryId: z.string(),
  documentId: z.string().optional(),
  llmConfig: z.object({
    top_k: z.string(),
    top_p: z.string(),
    temperature: z.number(),
    max_output_token: z.string(),
  }),
  knowledgeSource: z.enum(["website", "document", "text"]),
  websiteLink: z.string().optional(),
  websiteContent: z.string().optional(),
  textContent: z.string().optional(),
  documentContent: z.string().optional(),
  botDetails: z
    .object({
      agentName: z.string(),
      agentLanguage: z.string(),
      region: z.string(),
      timezone: z.string(),
      version: z.string(),
      industryType: z.string().optional(),
      role: z.string(),
      goal: z.string(),
      otherRole: z.string().optional(),
      otherGoal: z.string().optional()
    }),
  textToSpeechConfig: z.record(z.any()),
  speechToTextConfig: z.record(z.any()),
  ivrConfig: z.string(),
  incomingPhoneNumber: z.string(),
}).superRefine((data, ctx) => {
    const source = data.knowledgeSource;
    if (source === "website") {
      if (!data.websiteLink) {
        ctx.addIssue({
          path: ["websiteLink"],
          code: z.ZodIssueCode.custom,
          message: "websiteLink is required when knowledgeSource is 'website'",
        });
      }
      if (!data.websiteContent) {
        ctx.addIssue({
          path: ["websiteContent"],
          code: z.ZodIssueCode.custom,
          message: "websiteContent is required when knowledgeSource is 'website'",
        });
      }
    }

    if (source === "text" && !data.textContent) {
      ctx.addIssue({
        path: ["textContent"],
        code: z.ZodIssueCode.custom,
        message: "textContent is required when knowledgeSource is 'text'",
      });
    }

    if (source === "document" && !data.documentId) {
      ctx.addIssue({
        path: ["documentId"],
        code: z.ZodIssueCode.custom,
        message: "documentId is required when knowledgeSource is 'document'",
      });
    }
});

export const zodUpdateNewVoicebotSchema = z.object({
  name: z.string().optional(),
  active: z.boolean().optional(),
  industryId: z.string().optional(),
  documentId: z.string().optional(),
  llmConfig: z.object({
    top_p: z.string().optional(),
    top_k: z.string().optional(),
    temperature: z.number(),
    max_output_token: z.string(),
    inboundPromptText: z.string(),
    outboundPromptText: z.string()
  }).optional(),
  knowledgeSource: z.enum(["website", "document", "text"]).optional(),
  websiteLink: z.string().optional(),
  websiteContent: z.string().optional(),
  textContent: z.string().optional(),
  documentContent: z.string().optional(),
  botDetails: z
    .object({
      agentName: z.string(),
      agentLanguage: z.string(),
      region: z.string(),
      timezone: z.string(),
      version: z.string(),
      industryType: z.string().optional(),
      role: z.string(),
      goal: z.string(),
      otherRole: z.string().optional(),
      otherGoal: z.string().optional()
  }).optional(),
  textToSpeechConfig: z.record(z.any()).optional(),
  speechToTextConfig: z.record(z.any()).optional(),
  ivrConfig: z.any().optional(),
  incomingPhoneNumber: z.any().optional(),
  emailRecipients: z.array(z.string()).optional(),
  preRecordedAudios: z.object({
    welcomeAudio: z.array(z.any()).optional(),
    concludeAudio: z.array(z.any()).optional(),
    fillerAudio: z.array(z.any()).optional(),
    ambientNoiseAudio: z.array(z.any()).optional(),
    forwardCallAudio: z.array(z.any()).optional(),
  }).optional(),
  clientConfig: z.object({
    llmCaching: z.boolean().optional(),
    dynamicCaching: z.boolean().optional(),
    distance: z.number().optional(),
  }).optional(),
  audioFiles: z.record(z.any()).optional(),
  tools: z.object({
    clientTools: z.array(z.any()).optional(),
    defaultTools: z.array(z.string()).optional(),
  }).optional(),
  intent: z.string().optional(),
}).superRefine((data, ctx) => {
    const source = data.knowledgeSource;
    if (source === "website") {
      if (!data.websiteLink) {
        ctx.addIssue({
          path: ["websiteLink"],
          code: z.ZodIssueCode.custom,
          message: "websiteLink is required when knowledgeSource is 'website'",
        });
      }
      if (!data.websiteContent) {
        ctx.addIssue({
          path: ["websiteContent"],
          code: z.ZodIssueCode.custom,
          message: "websiteContent is required when knowledgeSource is 'website'",
        });
      }
    }

    if (source === "text" && !data.textContent) {
      ctx.addIssue({
        path: ["textContent"],
        code: z.ZodIssueCode.custom,
        message: "textContent is required when knowledgeSource is 'text'",
      });
    }

     if (source === "document" && !data.documentId) {
      ctx.addIssue({
        path: ["documentId"],
        code: z.ZodIssueCode.custom,
        message: "documentId is required when knowledgeSource is 'document'",
      });
    }
});

export const getOrgTotalVoicebots = async(organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  return await db
  .select({ createdAt: voicebotSchema.createdAt })
  .from(voicebotSchema)
  .where( and(
    ...(fromDate && toDate ? [
        gte(voicebotSchema.createdAt, fromDate),
        lte(voicebotSchema.createdAt, toDate),
      ] : []),
    eq(voicebotSchema.organizationId, organizationId),
    eq(voicebotSchema.isDeleted, false)
    )
  )
}

export const getOrgTotalCalls = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined, direction?: string) => {
  return await db
    .select({ createdAt: callLogSchema.createdAt, duration: callLogSchema.duration })
    .from(callLogSchema)
    .where( and(
        ...(fromDate && toDate ? [
        gte(callLogSchema.createdAt, fromDate),
        lte(callLogSchema.createdAt, toDate),
        ] : []),
        eq(callLogSchema.organizationId, organizationId),
        ...(direction ? [eq(callLogSchema.direction, direction)] : [])
      )
    )
}

export const getOrgVoiceLeads = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  return await db
  .select({ createdAt: voicebotLeadSchema.createdAt })
  .from(voicebotLeadSchema)
  .where( and(
    ...(fromDate && toDate ? [
        gte(voicebotLeadSchema.createdAt, fromDate),
        lte(voicebotLeadSchema.createdAt, toDate),
      ] : []),
    eq(voicebotLeadSchema.organizationId, organizationId)
  ))
}

export const getOrgVoicebotsByFilter = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined, active: boolean) => {
   return await db
  .select({ createdAt: voicebotSchema.createdAt })
  .from(voicebotSchema)
  .where( and(
    ...(fromDate && toDate ? [
        gte(voicebotSchema.createdAt, fromDate),
        lte(voicebotSchema.createdAt, toDate),
      ] : []),
    eq(voicebotSchema.active, active),
    eq(voicebotSchema.organizationId, organizationId),
    eq(voicebotSchema.isDeleted, false)
    )
  )
}

export const getOrgTotalCallsInMins = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  const data = await db
    .select({ duration: callLogSchema.duration })
    .from(callLogSchema)
    .where( and(
        ...(fromDate && toDate ? [
         between(callLogSchema.createdAt, fromDate, toDate)
        ] : []),
        eq(callLogSchema.organizationId, organizationId),
      )
    )
  const totalMinutes = data.reduce((acc: any, item: any) => acc + Math.round(item?.duration / 60), 0)
  return totalMinutes
}

export const getCallLogsByCallStatus = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined, callStatus: string) => {
  return await db.select({ createdAt: callLogSchema.createdAt })
  .from(callLogSchema)
  .where(
    and(
      ...(fromDate && toDate ? [
         between(callLogSchema.createdAt, fromDate, toDate)
      ] : []),
      eq(callLogSchema.organizationId, organizationId),
      eq(callLogSchema.callStatus, callStatus)
    )
  )
}

export const getUniqueCallNumbers = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
   const result = await db
    .select({
      count: sql<number>`COUNT(DISTINCT ${callLogSchema.from})`
    })
    .from(callLogSchema)
    .where(
      and(
        ...(fromDate && toDate
          ? [
              gte(callLogSchema.createdAt, fromDate),
              lte(callLogSchema.createdAt, toDate)
            ]
          : []),
        eq(callLogSchema.organizationId, organizationId)
      )
    )

  return result[0]?.count || 0
}

export const getVoicebotReEngagementRate = async (
  organizationId: string,
  fromDate?: Date,
  toDate?: Date
) => {
  const baseConditions = [
    eq(callLogSchema.organizationId, organizationId),
    ...(fromDate && toDate
      ? [
          gte(callLogSchema.createdAt, fromDate),
          lte(callLogSchema.createdAt, toDate),
        ]
      : [])
  ]

  // 1. Total Unique Callers
  const uniqueCallers = await db
    .select({ 
      count: sql<number>`COUNT(DISTINCT ${callLogSchema.from})`
    })
    .from(callLogSchema)
    .where(and(...baseConditions))

  const totalUnique = Number(uniqueCallers[0]?.count) || 0

  // 2. Returning Callers (phone numbers with more than 1 call)
  const returningCallers = await db
    .select({
      phoneNumber: callLogSchema.from
    })
    .from(callLogSchema)
    .where(and(...baseConditions))
    .groupBy(callLogSchema.from)
    .having(sql`COUNT(*) > 1`)

  const reengaged = returningCallers.length

  const rate = totalUnique > 0 ? (reengaged / totalUnique) * 100 : 0

  return {
    totalUniqueCallers: totalUnique,
    returningCallers: reengaged,
    reEngagementRate: `${Math.round(rate)}%`
  }
}

export const getVoiceDropoffCalls = async (
  organizationId: string,
  fromDate?: Date,
  toDate?: Date
) => {
  const data = await db
  .select({ metrics: callLogSchema.metrics })
  .from(callLogSchema)
  .where(
    and(
      eq(callLogSchema.organizationId, organizationId),
      ...(fromDate && toDate
        ? [
            gte(callLogSchema.createdAt, fromDate),
            lte(callLogSchema.createdAt, toDate),
          ]
        : []),
      isNotNull(callLogSchema.metrics)
    )
  )
  
  const dropoffCalls = data.filter((item: any) => {
    const metrics = item?.metrics
    return metrics?.dropOffRate === true
  })
 
  return dropoffCalls.length || 0
}

export const getQualifiedCalls = async(organizationId: string,
  fromDate?: Date,
  toDate?: Date) => {
  const data = await db
  .select({ metrics: callLogSchema.metrics })
  .from(callLogSchema)
  .where(
    and(
      eq(callLogSchema.organizationId, organizationId),
      ...(fromDate && toDate
        ? [
            gte(callLogSchema.createdAt, fromDate),
            lte(callLogSchema.createdAt, toDate),
          ]
        : []),
      isNotNull(callLogSchema.metrics)
    )
  )

  const qualifiedCalls = data.filter((item: any) => {
    const metrics = item?.metrics
    return (metrics.leadClassification === "warm" || metrics.leadClassification === "hot")
  })

  return qualifiedCalls.length || 0
}


export const getVoiceQualificationAccuracy = async (
  organizationId: string,
  fromDate?: Date,
  toDate?: Date
) => {
  const baseConditions = [
    eq(callLogSchema.organizationId, organizationId),
    ...(fromDate && toDate
      ? [gte(callLogSchema.createdAt, fromDate), lte(callLogSchema.createdAt, toDate)]
      : [])
  ]

  const qualifiedCondition = sql`(metrics->>'leadClassification') IN ('hot', 'warm', 'cold')`
  const accurateCondition = sql`(metrics->>'leadClassification') IN ('hot', 'warm')`

  // Qualified leads
  const qualifiedLeads = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(callLogSchema)
    .where(and(...baseConditions, qualifiedCondition))

  // Accurate leads
  const accurateLeads = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(callLogSchema)
    .where(and(...baseConditions, accurateCondition))

  const qualified = qualifiedLeads[0]?.count || 0
  const accurate = accurateLeads[0]?.count || 0
  const accuracy = qualified > 0 ? (accurate / qualified) * 100 : 0

  return {
    totalQualified: qualified,
    accurateLeads: accurate,
    leadQualificationAccuracy: `${Math.round(accuracy)}%`,
  }
}

export const getVoiceCallClassificationCounts = async (
  organizationId: string,
  fromDate?: Date,
  toDate?: Date
) => {
  const baseConditions = [
    eq(callLogSchema.organizationId, organizationId),
    ...(fromDate && toDate
      ? [gte(callLogSchema.createdAt, fromDate), lte(callLogSchema.createdAt, toDate)]
      : [])
  ]

  const results = await db
    .select({
      leadClassification: sql<string>`metrics->>'leadClassification'`,
      count: sql<number>`COUNT(*)`,
    })
    .from(callLogSchema)
    .where(and(...baseConditions))
    .groupBy(sql`metrics->>'leadClassification'`)

  // Initialize leadComposition with default values
  const leadComposition = {
    warmLeads: 0,
    hotLeads: 0,
    coldLeads: 0,
    junkLeads: 0,
  }

  for (const row of results) {
    const classification = row.leadClassification?.toLowerCase()
    if (classification === "hot") leadComposition.hotLeads = Number(row.count)
    else if (classification === "warm") leadComposition.warmLeads = Number(row.count)
    else if (classification === "cold") leadComposition.coldLeads = Number(row.count)
    else if (classification === "junk") leadComposition.junkLeads = Number(row.count)
  }

  return leadComposition
}


// Voice call schedule 
export const createVoiceCallSchdeuling = async (data: InsertVoicebotCallSchedule) => {
  return await db.insert(voicebotCallScheduleSchema).values(data)
}

// outbound calls
export const getNotDialedCallListByCampaignId = async(campaignId: string) => {
  return await db.query.voicebotCallScheduleSchema.findMany({
    where: and(
      eq(voicebotCallScheduleSchema.campaignId, campaignId),
      eq(voicebotCallScheduleSchema.callStatus, "Not Dialed")
    )
  })
}

export const getAllFailedCallList = async () => {
  return await db.query.voicebotCallScheduleSchema.findMany({
    where: and(
      inArray(voicebotCallScheduleSchema.callStatus, ["Failed", "No Response"]),
      eq(voicebotCallScheduleSchema.isRetryExpired, false)
    )
  })
}

export const getVoiceScheduledContactsByCampaignId = async (organizationId: string, campaignId: string, timeZone: string, query?: any) => {
  let filters: any = [eq(voicebotCallScheduleSchema.campaignId, campaignId)];
  let page, offset, limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }

  if (query?.fromDate && query?.toDate) {
    let fromDate = momentTz(query?.fromDate).tz(timeZone).startOf("day").toDate() 
    let toDate= momentTz(query?.toDate).tz(timeZone).endOf("day").toDate()

    if (fromDate && toDate) {
      filters.push(
        gte(voicebotCallScheduleSchema.createdAt, fromDate),
        lte(voicebotCallScheduleSchema.createdAt, toDate),
      )
    }
  }

  if(query?.status) {
    filters.push(eq(voicebotCallScheduleSchema.callStatus, query?.status))
  }

  let data: any = await db.query.voicebotCallScheduleSchema.findMany({
    where: and(...filters),
    with: {
      bot: { columns: { name: true } },
      contactGroup: { columns: { groupName: true } },
      campaign: { columns: {
         contactMethod: true,
         campaignName: true,
      }},
      contact: {
        where:
          query?.q ? or(
            ilike(contactProfileSchema.name, `%${query?.q}%`),
            ilike(contactProfileSchema.phoneNumber, `%${query?.q}%`),
          ) : undefined,
        columns: {
          name: true,
          countryCode: true,
          phoneNumber: true,
          source: true,
          metadata: true,
          verificationId: true
        }
      }
    },
    orderBy: [desc(voicebotCallScheduleSchema.createdAt)],
  })

  const callLogsList: any = await getCallLogsList(organizationId, timeZone)
  
  data = data.map((i: any) => {
    const callLogDetail = callLogsList.find((log: any) => log.callSid === i.callSid)
    return {
      ...i,
      link: i?.callSid && callLogDetail ? `${config.newFrontendUrl}/dashboard/customer-logs/calls/${callLogDetail?.id}` : null,
      contactGroup: i.contactGroup.groupName,
      bot: i.bot.name,
      createdAt: momentTz(i.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
      updatedAt: momentTz(i.updatedAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
    }
  })

  if(query?.q) {
    data = data.filter((i: any) => i.contact !== null )
  }

  if (query?.page && query?.limit) {
    const paginatedCallList = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedCallList,
    };
  } else {
    return data;
  }
}

export const updateVoiceScheduledCall = async(id: string, body: any) => {
  return (await db.update(voicebotCallScheduleSchema)
    .set({ 
      ...body,
      updatedAt: new Date()
    })
    .where(eq(voicebotCallScheduleSchema.id, id))
    .returning())[0]
}

export const updateVoiceScheduledCallByCallSid = async (callSid: string, status: string) => {
  return (await db.update(voicebotCallScheduleSchema)
  .set({
    callStatus: status,
    updatedAt: new Date()
  }).where(eq(voicebotCallScheduleSchema.callSid, callSid))
  .returning())[0]
}

// Improvements
export const createVoicebotImprovementQueries = async (data: InsertVoiceResponseImprovement) => {
  return (await db.insert(voiceResponseImprovementSchema).values(data).returning())[0]
}

export const getVoicebotQueriesByStatus = async (voicebotId: string, status: "trained" | "not_trained") => {
  return await db.query.voiceResponseImprovementSchema.findMany({
    where: and(
      eq(voiceResponseImprovementSchema.botId, voicebotId),
      eq(voiceResponseImprovementSchema.status, status)
    )
  })
}

export const getVoicebotQueryById = async (queryId: string) => {
  return await db.query.voiceResponseImprovementSchema.findFirst({
    where: eq(voiceResponseImprovementSchema.id, queryId)
  })
}

export const updateVoicebotImprovementQueries = async (id: string, data: Partial<InsertVoiceResponseImprovement>) => {
  return (
    await db.update(voiceResponseImprovementSchema).set({
      ...data,
      updatedAt: new Date()
    }).where(
      eq(voiceResponseImprovementSchema.id, id)
    ).returning()
  )[0]
}