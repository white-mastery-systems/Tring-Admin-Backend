import { InsertVoicebotCaching, InsertVoicebotCallSchedule, InsertVoiceResponseImprovement, voicebotCacheSchema, voicebotCallScheduleSchema } from "~/server/schema/voicebot"
import momentTz from "moment-timezone"
import { count, inArray } from "drizzle-orm"

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

export const getAllVoicebotTelephoneNumbers = async () => {
  return await db
    .select({ incomingPhoneNumber: voicebotSchema.incomingPhoneNumber })
    .from(voicebotSchema)
    .where(
      and(
        isNotNull(voicebotSchema.incomingPhoneNumber),
        eq(voicebotSchema.isDeleted, false)
      )
    );
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
  cacheConfig: z.object({
    active: z.boolean().optional(),
    distance: z.number().optional(),
  }).optional(),
  audioFiles: z.record(z.any()).optional(),
  tools: z.object({
    clientTools: z.array(z.any()).optional(),
    defaultTools: z.array(z.string()).optional(),
  }).optional(),
  voicemailConfig: z.object({
    hangup: z.boolean().optional(),
    leaveMessage: z.boolean().optional(),
    message: z.string().optional()
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

export const getOrgInteractedCalls = async (
  organizationId: string,
  fromDate?: Date,
  toDate?: Date
) => {
  const data = await db
  .select({ createdAt: callLogSchema.createdAt })
  .from(callLogSchema)
  .where(
    and(
    ...(fromDate && toDate
      ? [
          gte(callLogSchema.createdAt, fromDate),
          lte(callLogSchema.createdAt, toDate),
        ]
      : []),
    eq(callLogSchema.organizationId, organizationId),
    eq(callLogSchema.interacted, true)
    )
  )

  return data.length
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

export const getVoiceScheduledContactsByCampaignId = async (
  organizationId: string,
  campaignId: string,
  timeZone: string,
  query?: any
) => {
  let filters: any[] = [eq(voicebotCallScheduleSchema.campaignId, campaignId)];

  // Date filter (applies everywhere)
  if (query?.fromDate && query?.toDate) {
    const fromDate = momentTz(query.fromDate).tz(timeZone).startOf("day").toDate();
    const toDate = momentTz(query.toDate).tz(timeZone).endOf("day").toDate();
    filters.push(
      gte(voicebotCallScheduleSchema.createdAt, fromDate),
      lte(voicebotCallScheduleSchema.createdAt, toDate)
    );
  }

  if (query?.status) {
    filters.push(eq(voicebotCallScheduleSchema.callStatus, query.status));
  }

  // Pagination params
  const page = query?.page ? parseInt(query.page) : 1;
  const limit = query?.limit ? parseInt(query.limit) : 10;
  const offset = (page - 1) * limit;

  // 🟢 1. Aggregate counts (ignore search `q`)
  const counts = await db
    .select({
      status: voicebotCallScheduleSchema.callStatus,
      count: sql<number>`COUNT(*)`,
    })
    .from(voicebotCallScheduleSchema)
    .where(and(...filters))
    .groupBy(voicebotCallScheduleSchema.callStatus);

  const totalContacts = counts.reduce((acc, c) => acc + Number(c.count), 0);
  const deliveredContacts = counts
    .filter((c) => c.status && !["Not Dialed", "Failed"].includes(c.status))
    .reduce((acc, c) => acc + Number(c.count), 0);
  const failedContacts = counts
    .filter((c) => c.status && ["Failed"].includes(c.status))
    .reduce((acc, c) => acc + Number(c.count), 0);

  // 🟢 2. Search filter (requires join with contactProfileSchema)
  let searchFilter;
  if (query?.q) {
    searchFilter = or(
      ilike(contactProfileSchema.name, `%${query.q}%`),
      ilike(contactProfileSchema.phoneNumber, `%${query.q}%`)
    );
  }

  // 🟢 3. Total count WITH search
  const totalCountResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(voicebotCallScheduleSchema)
    .leftJoin(contactProfileSchema, eq(contactProfileSchema.id, voicebotCallScheduleSchema.contactId))
    .where(and(...filters, searchFilter));
  const totalCount = Number(totalCountResult[0]?.count) || 0;

 const data = await db
  .select({
    schedule: {
      id: voicebotCallScheduleSchema.id,
      callSid: voicebotCallScheduleSchema.callSid,
      callStatus: voicebotCallScheduleSchema.callStatus,
      createdAt: voicebotCallScheduleSchema.createdAt,
      updatedAt: voicebotCallScheduleSchema.updatedAt,
    },
    contact: {
      id: contactProfileSchema.id,
      name: contactProfileSchema.name,
      phoneNumber: contactProfileSchema.phoneNumber,
      countryCode: contactProfileSchema.countryCode,
      source: contactProfileSchema.source,
      metadata: contactProfileSchema.metadata,
      verificationId: contactProfileSchema.verificationId,
    },
    contactGroup: {
      groupName: contactGroupSchema.groupName,
    },
    bot: {
      name: voicebotSchema.name,
    },
    campaign: {
      campaignName: newCampaignSchema.campaignName,
    },
  })
  .from(voicebotCallScheduleSchema)
  .leftJoin(contactProfileSchema, eq(contactProfileSchema.id, voicebotCallScheduleSchema.contactId))
  .leftJoin(contactGroupSchema, eq(contactGroupSchema.id, voicebotCallScheduleSchema.contactGroupId))
  .leftJoin(voicebotSchema, eq(voicebotSchema.id, voicebotCallScheduleSchema.botId))
  .leftJoin(newCampaignSchema, eq(newCampaignSchema.id, voicebotCallScheduleSchema.campaignId))
  .where(and(...filters, searchFilter))
  .orderBy(desc(voicebotCallScheduleSchema.createdAt))
  .limit(limit)
  .offset(offset);

 // 4️⃣ Preload call logs only for fetched callSids
  const callSids = data.map((row) => row.schedule.callSid).filter(Boolean);
  const callLogsList = callSids.length
    ? await getCallLogsList(organizationId, timeZone, callSids)
    : [];

 const rows = data.map((row) => {
  const { schedule, contact, contactGroup, bot, campaign } = row;
  const callLogDetail = callLogsList.find((log: any) => log.callSid === schedule.callSid);

  return {
    ...schedule,
    contact,
    contactGroup: contactGroup?.groupName || null,
    bot: bot?.name || null,
    campaignName: campaign?.campaignName || null,
    link:
      schedule.callSid && callLogDetail
        ? `${config.newFrontendUrl}/dashboard/customer-logs/calls/${callLogDetail.id}`
        : null,
    createdAt: momentTz(schedule.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
    updatedAt: momentTz(schedule.updatedAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
  };
});


  return {
    totalContacts,       // full campaign counts
    deliveredContacts,   // full campaign counts
    failedContacts,      // full campaign counts
    scheduledContacts: {
      page,
      limit,
      totalPageCount: Math.ceil(totalCount / limit) || 1,
      totalCount,        // filtered count (with search)
      data: rows,
    },
  };
};


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

export const getVoicebotQueriesByStatus = async (voicebotId: string, status: "trained" | "not_trained" | "ignored", query?: any) => {
  let page, offset, limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }
  
  let data = await db.query.voiceResponseImprovementSchema.findMany({
    where: and(
      eq(voiceResponseImprovementSchema.botId, voicebotId),
      eq(voiceResponseImprovementSchema.status, status),
      sql`cardinality(${voiceResponseImprovementSchema.instances}) > 0`,
      query?.q
        ? ilike(voiceResponseImprovementSchema.title, `%${query.q}%`)  
        : undefined,
    ),
    orderBy: [
      sql`cardinality(${voiceResponseImprovementSchema.instances}) DESC`
    ]
  })

  if (query?.page && query?.limit) {
    const paginatedVoicebotQueries = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedVoicebotQueries,
    };
  } else {
    return data
  }
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

export const deleteVoiceImprovementById = async (id: string) => {
  return (
    await db.delete(voiceResponseImprovementSchema).where(
    eq(voiceResponseImprovementSchema.id, id)
    ).returning()
  )[0]
}

export const getVoiceImprovementsByOrgId = async (organizationId: string) => {
  const result = await db
    .select({
      total: sql<number>`COUNT(*)`,
      trained: sql<number>`COUNT(*) FILTER (WHERE ${voiceResponseImprovementSchema.status} = 'trained')`,
      notTrained: sql<number>`COUNT(*) FILTER (WHERE ${voiceResponseImprovementSchema.status} = 'not_trained')`,
      ignored: sql<number>`COUNT(*) FILTER (WHERE ${voiceResponseImprovementSchema.status} = 'ignored')`,
      highPriority: sql<number>`COUNT(*) FILTER (WHERE cardinality(${voiceResponseImprovementSchema.instances}) > 1)`,

      // Potential impacts - using COALESCE to handle null arrays and SUM to count instances
      totalImpact: sql<number>`SUM(COALESCE(cardinality(${voiceResponseImprovementSchema.instances}), 0))`,
      trainedImpact: sql<number>`SUM(CASE WHEN ${voiceResponseImprovementSchema.status} = 'trained' THEN COALESCE(cardinality(${voiceResponseImprovementSchema.instances}), 0) ELSE 0 END)`,
      highPriorityImpact: sql<number>`SUM(CASE WHEN cardinality(${voiceResponseImprovementSchema.instances}) > 1 THEN COALESCE(cardinality(${voiceResponseImprovementSchema.instances}), 0) ELSE 0 END)`
    })
    .from(voiceResponseImprovementSchema)
    .where(eq(voiceResponseImprovementSchema.organizationId, organizationId));

  const total = result[0].total;
  const trained = result[0].trained;

  const healthScore = total > 0
    ? `${Math.round((trained / total) * 100)}%`
    : "100%"; // Default to 100 if no improvements exist

  return {
    healthScore: {
      score: healthScore,
      potentialImpact: Number(result[0].trainedImpact) || 0,
    },
    highPriority: {
      count: Number(result[0].highPriority) || 0,
      potentialImpact: Number(result[0].highPriorityImpact) || 0,
    },
    totalImprovements: {
      count: Number(total) || 0,
      potentialImpact: Number(result[0].totalImpact) || 0,
    }
  };
};


// export const getVoiceImprovementsByOrgId = async (organizationId: string) => {
//  const result = await db
//     .select({
//       total: sql<number>`COUNT(*)`,
//       trained: sql<number>`COUNT(*) FILTER (WHERE ${voiceResponseImprovementSchema.status} = 'trained')`,
//       notTrained: sql<number>`COUNT(*) FILTER (WHERE ${voiceResponseImprovementSchema.status} = 'not_trained')`,
//       ignored: sql<number>`COUNT(*) FILTER (WHERE ${voiceResponseImprovementSchema.status} = 'ignored')`,
//       highPriority: sql<number>`COUNT(*) FILTER (WHERE cardinality(${voiceResponseImprovementSchema.instances}) > 1)`
//     })
//     .from(voiceResponseImprovementSchema)
//     .where(eq(voiceResponseImprovementSchema.organizationId, organizationId));

//   const total = result[0].total;
//   const trained = result[0].trained;

//   const healthScore = total > 0
//     ? `${Math.round((trained / total) * 100)}%`
//     : "100%"; // Default to 100 if no improvements exist

//   return {
//     totalImprovements: total,
//     trainedImprovements: trained,
//     highPriorityImprovements: result[0].highPriority,
//     healthScore
//   };
// }

export const getVoiceImprovementWeeklyHealthScore = async (organizationId: string, timezone: string) => {
  // Week ranges
  const currentWeekStart = momentTz.tz(timezone).startOf("isoWeek").toDate();
  const currentWeekEnd = momentTz.tz(timezone).endOf("isoWeek").toDate();

  const lastWeekStart = momentTz.tz(timezone).subtract(1, "week").startOf("isoWeek").toDate();
  const lastWeekEnd = momentTz.tz(timezone).subtract(1, "week").endOf("isoWeek").toDate();

  // Fetch improvements
  const [currentWeekImprovements, lastWeekImprovements] = await Promise.all([
    db.select().from(voiceResponseImprovementSchema).where(
      and(
        eq(voiceResponseImprovementSchema.organizationId, organizationId),
        gte(voiceResponseImprovementSchema.createdAt, currentWeekStart),
        lte(voiceResponseImprovementSchema.createdAt, currentWeekEnd)
      )
    ),
    db.select().from(voiceResponseImprovementSchema).where(
      and(
        eq(voiceResponseImprovementSchema.organizationId, organizationId),
        gte(voiceResponseImprovementSchema.createdAt, lastWeekStart),
        lte(voiceResponseImprovementSchema.createdAt, lastWeekEnd)
      )
    ),
  ]);

  // Calculate current health score
  const currentWeekTotal = currentWeekImprovements.length;
  const currentWeekTrained = currentWeekImprovements.filter(i => i.status === "trained").length;
  const currentWeekScore = currentWeekTotal > 0 ? Math.round((currentWeekTrained / currentWeekTotal) * 100) : 0;

  // Calculate last week health score
  const lastWeekTotal = lastWeekImprovements.length;
  const lastWeekTrained = lastWeekImprovements.filter(i => i.status === "trained").length;
  const lastWeekScore = lastWeekTotal > 0 ? Math.round((lastWeekTrained / lastWeekTotal) * 100) : 0;

  // Calculate growth
  const growth = currentWeekScore - lastWeekScore;
  const trend = growth >= 0 ? `+${growth}% from last week` : `${growth}% from last week`;

  return {
    healthScore: `${currentWeekScore}%`,
    trend,
    currentWeek: {
      total: currentWeekTotal,
      trained: currentWeekTrained,
    },
    lastWeek: {
      total: lastWeekTotal,
      trained: lastWeekTrained,
    }
  };
}

export const getVoicebotImprovementDetailsByOrgId = async (organizationId: string, limit?: string) => {
  const voicebotImprovementQuery =  db
    .select({
      instanceCount: sql`cardinality(${voiceResponseImprovementSchema.instances})`,
      id: voiceResponseImprovementSchema.id, 
      title: voiceResponseImprovementSchema.title,
      botName: voicebotSchema.name,
      botId: voicebotSchema.id
    })
    .from(voiceResponseImprovementSchema)
    .leftJoin(voicebotSchema, eq(voiceResponseImprovementSchema.botId, voicebotSchema.id))
    .where(
      and(
        eq(voiceResponseImprovementSchema.organizationId, organizationId),
        sql`cardinality(${voiceResponseImprovementSchema.instances}) > 0`
      )
    )
    .orderBy(
      sql`cardinality(${voiceResponseImprovementSchema.instances}) DESC`,
      desc(voiceResponseImprovementSchema.createdAt)
    );
    if(limit) {
      const limitNumber = parseInt(limit)
      voicebotImprovementQuery.limit(limitNumber)
    }
  return await voicebotImprovementQuery
}
 
// Voicebot Caching
export const createVoicebotCaching = async (data: InsertVoicebotCaching[]) => {
  return (
    await db.insert(voicebotCacheSchema).values(data).returning()
  )[0]
}

export const getVoicebotCacheList = async (botId: string, query: any) => {
  let page, offset, limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }

  let data: any = await db.select()
    .from(voicebotCacheSchema)
    .where(
      and(
        eq(voicebotCacheSchema.botId, botId),
        query?.q
        ? ilike(voicebotCacheSchema.cache, `%${query.q}%`)
        : undefined
      )
    )

  const grouped = data.reduce((acc: any, item: any) => {
   const { audioId, text, cache, callLogId, query } = item;
    if (!acc[audioId]) {
      acc[audioId] = {
        audioId,
        cache,
        texts: [{
          text,
          query,
          callLogId
        }], // collect all text values
        cacheHits: 1
      };
    } else {
      acc[audioId].texts.push({
        text,
        query,
        callLogId
      });
      acc[audioId].cacheHits += 1;
    }
    return acc;
  }, {});

  // Convert to array
  const results = Object.values(grouped);

  // Sort by cacheHits
  const sortDirection = query?.sort === "asc" ? 1 : -1;

  results.sort((a: any, b: any) => {
    return sortDirection * (a.cacheHits - b.cacheHits);
  });

  if(query?.page && query?.limit) {
    const paginatedVoicebotCache = results.slice(offset, offset + limit);
    return { 
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(results.length / limit) || 1,
      totalCount: results.length,
      data: paginatedVoicebotCache,
    };
  } else {
    return results
  }
}

export const deleteVoicebotCaches = async (botId: string, isClearAll: boolean, audioId: string) => {
  return await db.delete(voicebotCacheSchema).where(
    (isClearAll) 
    ? eq(voicebotCacheSchema.botId, botId)
    : eq(voicebotCacheSchema.audioId, audioId)
  )
}