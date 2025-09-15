import momentTz from "moment-timezone";
import { campaignSchema, campaignWhatsappContactSchema, InsertCampaign } from "~/server/schema/admin";
import {whatsappErrorCodes} from "~/assets/error-codes.json"
import { notInArray } from "drizzle-orm";

const db = useDrizzle();
const config = useRuntimeConfig()

type InteractionStatus = "Booked" | "Engaged" | "Failed" | "Follow Up" | "Invalid Number" | "New Lead" | "Not Interested" | "No Response";

export const createCampaign = async (campaign: InsertCampaign) => {
  return (await db.insert(campaignSchema).values(campaign).returning())[0];
};

export const checkCampaignNameExist = async (
  organizationId: string,
  campaignName: string,
  campaignId?: string
) => {
  const conditions = [
    eq(campaignSchema.organizationId, organizationId),
    ilike(campaignSchema.campaignName, campaignName),
  ];

  // Exclude the specific bucket ID if provided
  if (campaignId) {
    conditions.push(ne(campaignSchema.id, campaignId));
  }

  return await db.query.campaignSchema.findFirst({
    where: and(...conditions),
  });
};

export const getAllVoiceCampaigns = async () => {
  return await db.query.campaignSchema.findMany({ 
    where: eq(campaignSchema.contactMethod, "voice")
  })
}

export const campaignList = async (
  organizationId: string,
  timeZone: string,
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

  let data: any = await db.query.campaignSchema.findMany({
      where: eq(campaignSchema.organizationId, organizationId),
      orderBy: [desc(campaignSchema.createdAt)],
    })

  const [campaignTotalContactList, voicebotContactList, dialedContactList] = await Promise.all([
    db.query.campaignWhatsappContactSchema.findMany({
      where: 
        eq(campaignWhatsappContactSchema.organizationId, organizationId)
    }),
    db.query.voicebotSchedularSchema.findMany({
       where: 
        eq(voicebotSchedularSchema.organizationId, organizationId)
    }),
    db.query.voicebotSchedularSchema.findMany({
       where: and(
          eq(voicebotSchedularSchema.organizationId, organizationId),
          notInArray(voicebotSchedularSchema.callStatus, ["not dialed", "failed", "Failed", "No Response", "Invalid Number"])
       )    
    })
  ]);

  data = data.map((i: any) => {
    let interactionCount, totalCount = 0
    let whatsappTotalCount = 0; let sent = 0; let delivered = 0; let read = 0; let failed = 0;
    if(i.contactMethod === "whatsapp") {
      for (const contact of campaignTotalContactList) {
        if (contact.campaignId === i.id) {
          whatsappTotalCount++;
          if (contact.messageStatus === "sent") sent++;
          else if (contact.messageStatus === "delivered") delivered++;
          else if (contact.messageStatus === "read") read++;
          else if (contact.messageStatus === "failed") failed++;
        }
      }
      totalCount = whatsappTotalCount;
      interactionCount = read;
    } 

    if(i.contactMethod === "voice") {
      totalCount = voicebotContactList?.filter((j)=> j.campaignId === i.id).length || 0
      interactionCount = dialedContactList?.filter((j)=> j.campaignId === i.id).length || 0
    }

     return {
       ...i,
       ...(i.contactMethod === "whatsapp" && {whatsappTotalCount, sent, delivered, read, failed}),
       totalCount,
       interactionCount,
       createdAt: momentTz(i?.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
    };
  })

  if (query?.page && query?.limit) {
    const paginatedCampaign = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedCampaign,
    };
  } else {
    return data;
  }
};

export const getCampaignById = async (campaignId: string) => {
  const data: any = await db.query.campaignSchema.findFirst({
    where: eq(campaignSchema.id, campaignId),
  });
  return data;
};

export const getVoiceBucketCampaignId = async (contactListId: string) => {
  return await db.query.campaignSchema.findFirst({
      where: and(
        eq(campaignSchema.bucketId, contactListId),
        eq(campaignSchema.contactMethod, "voice"),
      )
  })
}

export const updateCampaign = async (
  campaignId: string,
  campaign: InsertCampaign,
) => {
  return (
    await db
      .update(campaignSchema)
      .set({
        ...campaign,
        updatedAt: new Date(),
      })
      .where(eq(campaignSchema.id, campaignId))
      .returning()
  )[0];
};

export const deleteCampaign = async (campaignId: string) => {
  return (
    await db
      .delete(campaignSchema)
      .where(eq(campaignSchema.id, campaignId))
      .returning()
  )[0];
};

export const creatCampaignWhatsappContacts = async (data: any) => {
  return (await db.insert(campaignWhatsappContactSchema).values(data).returning())[0]
}

export const getWhatsappContactsByCampaignId = async (organizationId: string, campaignId: string, timeZone: string, query?: any) => {
  let filters: any = [eq(campaignWhatsappContactSchema.campaignId, campaignId)];
  let page, offset, limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }

  // Period-based filtering
  if (query?.period) {
    let fromDate: Date | undefined;
    let toDate: Date | undefined;
    const queryDate = getDateRangeForFilters(query, timeZone);
    fromDate = queryDate?.from;
    toDate = queryDate?.to;
    if (fromDate && toDate) {
      filters.push(between(campaignWhatsappContactSchema.createdAt, fromDate, toDate));
    }
  }

  let data: any = await db.query.campaignWhatsappContactSchema.findMany({
    where: and(
     ...filters,
     query?.q ? 
      or(
        ilike(campaignWhatsappContactSchema.firstName, `%${query?.q}%`),
        ilike(campaignWhatsappContactSchema.phone, `%${query?.q}%`),
        ) 
      : undefined,
    ),
    orderBy: [desc(campaignWhatsappContactSchema.createdAt)],
  });

  const chatList = await db.query.chatSchema.findMany({
    where: and(
      eq(chatSchema.organizationId, organizationId)
    )
  })

  data = data.map((i: any) => {
    const chatDetail = chatList.find((j)=> j.id === i.chatId)
    return{
    ...i,
    messageStatus: (i.chatId && chatDetail?.chatOutcome !== "No Response" )
      ? chatDetail?.chatOutcome
      : i.messageStatus,
    link: i.chatId ? `${config.newFrontendUrl}/dashboard/customer-logs/chats/${i.chatId}` : null,
    createdAt: momentTz(i?.createdAt)
      .tz(timeZone)
      .format("DD MMM YYYY hh:mm A"),
    ...(i.sentAt && 
      {
        sentAt: momentTz(i?.sentAt)
                .tz(timeZone)
                .format("DD MMM YYYY hh:mm A")
      }
    ),
    ...(i.deliveredAt && 
      {
        deliveredAt: momentTz(i?.deliveredAt)
                .tz(timeZone)
                .format("DD MMM YYYY hh:mm A")
      }
    ),
    ...(i.readAt && 
      {
        readAt: momentTz(i?.readAt)
                .tz(timeZone)
                .format("DD MMM YYYY hh:mm A")
      }
    )
  }
  });

  if (query?.page && query?.limit) {
    const paginatedCampaign = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedCampaign,
    };
  } else {
    return data;
  } 
}

export const updateWhatsappMessageStatus = async (campaignId: string, phoneNumber: string, messageId: string, pid: string, status: string) => {
  return (await db.update(campaignWhatsappContactSchema).set({
    messageId,
    pid,
    messageStatus: status,
    sentAt: new Date(),
    updatedAt: new Date(),
    deliveredAt: null,
    readAt: null
  }).where(and(
    eq(campaignWhatsappContactSchema.campaignId, campaignId),
    eq(campaignWhatsappContactSchema.phone, phoneNumber)
  )).returning())[0]
}

export const updateWhatsappMessageStatusByMessageId = async (messageId: string, data: any) => {
  const previousCampaignWhatspp = await db.query.campaignWhatsappContactSchema.findFirst({
    where: eq(campaignWhatsappContactSchema.messageId, messageId)
  })

  const payload: any = {
    ...data
  }
 
  if(data?.messageStatus === "delivered") {
    payload.deliveredAt = new Date()
  } else if(data?.messageStatus === "read") {
    payload.readAt = new Date()
    if(previousCampaignWhatspp?.messageStatus !== "delivered" && data?.messageStatus === "read") {
      payload.deliveredAt = new Date()
    }
  } else if (data?.messageStatus === "failed" && data?.errorCode) {
    payload.errorCode = data?.errorCode;
    // @ts-ignore
    payload.errorMessage = whatsappErrorCodes[payload.errorCode].message;
    // @ts-ignore
    payload.errorSolution = whatsappErrorCodes[payload.errorCode].solution;
  }

  return  await db.update(campaignWhatsappContactSchema).set({
    ...payload,
    updatedAt: new Date()
  }).where(
    and(
      eq(campaignWhatsappContactSchema.messageId, messageId),
      ne(campaignWhatsappContactSchema.messageStatus, "read")
    )
  )
}

export const updateWhatsappCampaignIntractStatusContact = async (campaignId: string, organizationId:string, phone: string, interactionStatus:InteractionStatus) => {
  const condition = and(eq(campaignWhatsappContactSchema.campaignId, campaignId), eq(campaignWhatsappContactSchema.organizationId, organizationId), eq(campaignWhatsappContactSchema.phone, phone))
  return (await db.update(campaignWhatsappContactSchema).set({interactionStatus}).where(condition).returning())[0] || null
}

export const getWhatsappCampaignByMessageId = async (messageId: string) => {
  return await db.query.campaignWhatsappContactSchema.findFirst({
    where: eq(campaignWhatsappContactSchema.messageId, messageId)
  })
}

export const getWhatsappCampaignContactsByMsgStatus = async (campaignId:string, msgStatus?:string) => {
  msgStatus = msgStatus ?? "sent"
  const data = await db.query.campaignWhatsappContactSchema.findMany({
    where: and(eq(campaignWhatsappContactSchema.campaignId, campaignId), eq(campaignWhatsappContactSchema.messageStatus, msgStatus))
  })

  return (data.length) ? data : null;
};