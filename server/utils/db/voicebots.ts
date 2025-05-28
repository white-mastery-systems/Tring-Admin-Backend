import { inArray } from "drizzle-orm";
import momentTz from "moment-timezone";
import { InsertVoiceBot, salesHandyContactsSchema, voicebotLeadSchema, voicebotSchedularSchema } from "~/server/schema/voicebot";

const db = useDrizzle();
interface listVoicebotQuery {
  active?: string;
  q?: string;
  page?: string;
  limit?: string;
  industryId?: string,
  callType?: string,
}

export const createVoicebot = async (voicebot: InsertVoiceBot) => {
  return (await db.insert(voicebotSchema).values(voicebot).returning())[0];
};

export const getVoicebotByIncomingPhoneNumber = async (incomingPhoneNumber: string, mode: string, voicebotId?: string) => {
  return await db.query.voicebotSchema.findFirst({
    where: and(
      eq(voicebotSchema.incomingPhoneNumber, incomingPhoneNumber),
      eq(voicebotSchema.isDeleted, false),
      (mode === "update" ? ne(voicebotSchema.id, voicebotId) : undefined)
    )  
  });
}

export const getVoicebotByName = async (organizationId: string, botName: string, mode: string, id?: string) => {
  return await db.query.voicebotSchema.findFirst({
    where: and(
      eq(voicebotSchema.organizationId, organizationId),
      eq(voicebotSchema.isDeleted, false),
      ilike(voicebotSchema.name, botName),
      ...(mode === "update" ? [ne(voicebotSchema.id, id)] : [])
    )
  })
}

export const getVoicebotByIvrConfigId = async (organizationId: string, ivrConfigId: string) => {
  return await db.query.voicebotSchema.findFirst({
    where: and(
      eq(voicebotSchema.organizationId, organizationId),
      eq(voicebotSchema.ivrConfig, ivrConfigId)
    )
  })
}

export const listVoicebots = async (
  organizationId: string,
  query: listVoicebotQuery,
  timeZone: string,
) => {
  let filters: any = [eq(voicebotSchema.organizationId, organizationId), eq(voicebotSchema.isDeleted, false)];

  if (query?.active === "true") {
    filters.push(eq(voicebotSchema.active, true));
  } else if (query?.active === "false") {
    filters.push(eq(voicebotSchema.active, false));
  }
  if (query?.q) {
    filters.push(ilike(voicebotSchema.name, `%${query.q}%`));
  }

  if(query?.industryId){
    filters.push(eq(voicebotSchema.industryId, query.industryId));
  }

   let page,
    offset,
    limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }

  let data: any = await db.query.voicebotSchema.findMany({
    where: and(...filters),
    orderBy: [desc(voicebotSchema.createdAt)],
  });
  data = data.map((i: any) => ({
    id: i.id,
    name: i.name,
    active: i.active,
    industryId: i.industryId,
    isDeleted: i.isDeleted,
    botDetails: i.botDetails,
    organizationId: i.organizationId,
    createdAt: momentTz(i.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
  }));

  if(query?.callType && query?.callType !== "all") {
    data = data.filter((i: any)=> i.botDetails?.callType === query?.callType)
  }

  if (query?.page && query?.limit) {
    const paginatedVoiceBots = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedVoiceBots,
    };
  } else {
    return data;
  }
};

export const getVoicebot = async (voicebotId: string) => {
 const data = await db.query.voicebotSchema.findFirst({
    where: eq(voicebotSchema.id, voicebotId),
  });
  return data;
}

export const getVoicebotById = async (
  voicebotId: string,
) => {
  const data = await db.query.voicebotSchema.findFirst({
    with: {
      ivrConfigDetail: true,
    },
    where: eq(voicebotSchema.id, voicebotId)
  });
  return data;
};

export const getVoicebotDetailByPhoneNumber = async(phonenumber: string) => {
  return await db.query.voicebotSchema.findFirst({
    where: eq(voicebotSchema.incomingPhoneNumber, phonenumber)
  })
}

export const updateVoiceBot = async (
  voicebotId: string,
  voicebot: Partial<InsertVoiceBot>,
) => {
  return (
    await db
      .update(voicebotSchema)
      .set({
        ...voicebot,
        updatedAt: new Date(),
      })
      .where(eq(voicebotSchema.id, voicebotId))
      .returning()
  )[0];
};

export const deleteVoiceBot = async (voicebotId: string) => {
  return (
    await db
      .delete(voicebotSchema)
      .where(eq(voicebotSchema.id, voicebotId))
      .returning()
  )[0];
};

// voiceBot integrations
export const createVoiceBotIntegration = async (
  voicebotIntegration: InsertVoicebotIntegration,
) => {
  return (
    await db
      .insert(voicebotIntegrationSchema)
      .values(voicebotIntegration)
      .returning()
  )[0];
};

export const listVoiceBotIntegrations = async (
  organizationId: string,
  voicebotId: string,
  query?: any,
) => {
  let page,
    offset,
    limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }
  let data = await db.query.voicebotIntegrationSchema.findMany({
    with: {
      integration: {
        where: query?.type ? eq(integrationSchema.type, query?.type) : undefined,
      }
    },
    where: and(
      eq(voicebotIntegrationSchema.organizationId, organizationId),
      eq(voicebotIntegrationSchema.botId, voicebotId),
    ),
  });

  
  if(query?.type) {
     data = data.filter((i: any) => i.integration !== null)
  }

  if (query?.page && query?.limit) {
    const paginatedVoiceBotIntegrations = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedVoiceBotIntegrations,
    };
  } else {
    return data;
  }
};

export const getVoiceBotIntegrationById = async (
  voicebotId: string,
  voicebotIntegrationId: string,
) => {
  const data = await db.query.voicebotIntegrationSchema.findFirst({
    where: and(
      eq(voicebotIntegrationSchema.botId, voicebotId),
      eq(voicebotIntegrationSchema.id, voicebotIntegrationId),
    ),
  });
  return data;
};

export const updateVoiceBotIntegration = async (
  voicebotId: string,
  voicebotIntegrationId: string,
  voicebotIntegration: any,
) => {
  return (
    await db
      .update(voicebotIntegrationSchema)
      .set(voicebotIntegration)
      .where(
        and(
          eq(voicebotIntegrationSchema.botId, voicebotId),
          eq(voicebotIntegrationSchema.id, voicebotIntegrationId),
        ),
      )
      .returning()
  )[0];
};

export const deleteVoicebotIntegration = async (
  voicebotId: string,
  voicebotIntegrationId: string,
) => {
  return (
    await db
      .delete(voicebotIntegrationSchema)
      .where(and(
        eq(voicebotIntegrationSchema.botId, voicebotId),
        eq(voicebotIntegrationSchema.id, voicebotIntegrationId),
      ))
      .returning()
  )[0];
};

// Leads creation for voicebot
export const createVoiceBotLead = async (leads: any) => {
  return (
    await db.insert(voicebotLeadSchema).values(leads).returning()
  )[0]
}

export const voicebotLeadList = async (organizationId: string, query: any, timeZone: string) => {
  let filters: any = [eq(voicebotLeadSchema.organizationId, organizationId)];
  if(query.botId && query.botId !== "all") {
    filters.push(eq(voicebotLeadSchema.botId, query.botId))
  }
  if(query?.q) {
    filters.push(or(
      ilike(voicebotLeadSchema.name, `%${query.q}%`),
      ilike(voicebotLeadSchema.phone, `%${query.q}%`),       
    ))
  }
  let page, offset, limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }
  if (query?.period) {
    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    const queryDate = getDateRangeForFilters(query, timeZone);
    fromDate = queryDate?.from;
    toDate = queryDate?.to;
    
    if (fromDate && toDate) {
      filters.push(between(voicebotLeadSchema.createdAt, fromDate, toDate));
    }
  }

  let voicebotLeads = await db.query.voicebotLeadSchema.findMany({
    with: {
      bot: {
        columns: {
          name: true
        }
      }
    },
    where: and(...filters),
    orderBy: [desc(voicebotLeadSchema.createdAt)]
  })

  voicebotLeads = voicebotLeads.map((i: any) => ({
    ...i,
    scheduledDate: i.scheduledDate && momentTz(i.scheduledDate).tz(timeZone).format("DD MMM YYYY hh:mm A"),
    createdAt: momentTz(i.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
  }));
  
  if (query?.page && query?.limit) {
    const paginatedvoicebotLeads = voicebotLeads.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(voicebotLeads.length / limit) || 1,
      totalCount: voicebotLeads.length,
      data: paginatedvoicebotLeads,
    };
  } else {
    return voicebotLeads;
  }
}

// Get all voicebot
export const getAllActiveVoicebots = async() => {
  return await db.query.voicebotSchema.findMany({
    where:  and(
      eq(voicebotSchema.active, true),
      eq(voicebotSchema.isDeleted, false)
    )
  })
}

// outbound calls
export const getNotDialedVoiceCallList = async() => {
  return await db.query.voicebotSchedularSchema.findMany({
    where: and(
      or(
        eq(voicebotSchedularSchema.callStatus, "not dialed"),
        inArray(voicebotSchedularSchema.callStatus, ["failed", "Failed"])
      ),
      lt(voicebotSchedularSchema.maxRetryCount, 5)
    )
  })
}

export const updateVoiceCallStatus = async(id: string, body: any) => {
  return (await db.update(voicebotSchedularSchema)
    .set({ 
      ...body,
      updatedAt: new Date()
    })
    .where(eq(voicebotSchedularSchema.id, id))
    .returning())[0]
}

// get organization voicebot plan
export const orgVoicebotSubscription = async (organizationId: string) => {
  return await db.query.orgSubscriptionSchema.findFirst({
    where: and(
      eq(orgSubscriptionSchema.organizationId, organizationId),
      eq(orgSubscriptionSchema.botType, "voice")
    )
  })
}

// voicebot schedular
export const createVoicebotSchedular = async (voicebotSchedular: any) => {
  return await db.insert(voicebotSchedularSchema).values(voicebotSchedular).returning()
}

export const updateVoiceScheduledContacts = async (callSid: string, data: any) => {
  await db.update(voicebotSchedularSchema).set({
    ...data,
    updatedAt: new Date()
  }).where(eq(voicebotSchedularSchema.callSid, callSid))
}

export const scheduledCampaignCallList = async (organizationId: string, campaignId: string, timeZone: string, query?: any ) => {
  let filters: any = [eq(voicebotSchedularSchema.organizationId, organizationId), eq(voicebotSchedularSchema.campaignId, campaignId)];
  let page, offset, limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }
  if (query?.period) {
    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    const queryDate = getDateRangeForFilters(query, timeZone);
    fromDate = queryDate?.from;
    toDate = queryDate?.to;
    if (fromDate && toDate) {
      filters.push(between(voicebotSchedularSchema.createdAt, fromDate, toDate));
    }
  }

  let data: any = await db.query.voicebotSchedularSchema.findMany({
    with: {
      bot: { columns: { name: true } },
      bucket: { columns: { name: true } },
      contact: {
        where:
          query?.q ? or(
            ilike(voicebotContactSchema.name, `%${query?.q}%`),
            ilike(voicebotContactSchema.phone, `%${query?.q}%`),
          ) : undefined,
        columns: {
          name: true,
          countryCode: true,
          phone: true,
          metadata: true,
          verificationId: true
        }
      }
    },
    where: and(...filters),
    orderBy: [desc(voicebotSchedularSchema.createdAt)],
  })

  data = data.map((i: any) => ({
    ...i,
    bucket: i.bucket.name,
    bot: i.bot.name,
    createdAt: momentTz(i.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
    updatedAt: momentTz(i.updatedAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
  }))

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

export const getAllSalesHandyvoiceBotIntegrations = async () => {
  return await db.query.voicebotIntegrationSchema.findMany({
    where: sql`${voicebotIntegrationSchema.metadata}->'sequenceObj'->>'id' IS NOT NULL`,
    with: { integration: true },
  });
}

export const createSalesHandyContact = async (contact: any) => {
  return (await db.insert(salesHandyContactsSchema).values(contact).returning())[0]
}

export const updateSalesHandyContact = async (id: string, contact: any) => {
  return await db.update(salesHandyContactsSchema).set(contact).where(eq(salesHandyContactsSchema.id, id)).returning()
}

export const getSalesHAndyNotDialedVoiceCallList = async () => {
  return await db.query.salesHandyContactsSchema.findMany({
    where: eq(salesHandyContactsSchema.callStatus, "not dialed"),
  })
}

export const fetchOrCreateSalesHandyContact = async (botId:string, botIntegrationId:string, sequenceId:string, phone:string, email?:string, countryCode?:string) => {
  const data = await db.query.salesHandyContactsSchema.findFirst({
    where: and(
      eq(salesHandyContactsSchema.botId, botId),
      eq(salesHandyContactsSchema.sequenceId, sequenceId),
      eq(salesHandyContactsSchema.phone, phone)
    )
  })

  if(!data){
    const payload = {
      botId, botIntegrationId, sequenceId,
      phone,
      ...((email) ? { email } : {}),
      ...((countryCode) ? { countryCode } : {}),
      callStatus: "not dialed"
    }
    return await createSalesHandyContact(payload)
  }
  return data
}

export const getNotDialSalesHandyContactList = async () => {
  return await db.query.salesHandyContactsSchema.findMany({
    where: eq(salesHandyContactsSchema.callStatus, "not dialed")
  })
}