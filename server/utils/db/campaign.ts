import momentTz from "moment-timezone";
import { campaignSchema, campaignWhatsappContactSchema, InsertCampaign } from "~/server/schema/admin";

const db = useDrizzle();

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

  const [campaignTotalContactList, campaignReadMsgContactList, voicebotContactList, dialedContactList] = await Promise.all([
    db.query.campaignWhatsappContactSchema.findMany({
      where: 
        eq(campaignWhatsappContactSchema.organizationId, organizationId)
      
    }),
    db.query.campaignWhatsappContactSchema.findMany({
      where: and(
        eq(campaignWhatsappContactSchema.organizationId, organizationId),
        eq(campaignWhatsappContactSchema.messageStatus, "read")
      )
    }),
    db.query.voicebotSchedularSchema.findMany({
       where: 
        eq(voicebotSchedularSchema.organizationId, organizationId)
    }),
    db.query.voicebotSchedularSchema.findMany({
       where: and(
          eq(voicebotSchedularSchema.organizationId, organizationId),
          eq(voicebotSchedularSchema.callStatus, "dialed")
       )    
    })
  ]);

  data = data.map((i: any) => {
    let interactionCount, totalCount = 0
    if(i.contactMethod === "whatsapp") {
      totalCount = campaignTotalContactList?.filter((j)=> j.campaignId === i.id).length || 0
      interactionCount = campaignReadMsgContactList?.filter((j)=> j.campaignId === i.id).length || 0
    } 

    if(i.contactMethod === "voice") {
      totalCount = voicebotContactList?.filter((j)=> j.campaignId === i.id).length || 0
      interactionCount = dialedContactList?.filter((j)=> j.campaignId === i.id).length || 0
    }

     return {
        ...i,
       totalCount,
       interactionCount,
       createdAt: momentTz(i?.createdAt)
      .tz(timeZone)
      .format("DD MMM YYYY hh:mm A"),
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

export const getCampaignById = async (campaignId: string, timeZone: string) => {
  const data: any = await db.query.campaignSchema.findFirst({
    where: eq(campaignSchema.id, campaignId),
  });
  // if (data) {
  //   data.createdAt = momentTz(data?.createdAt)
  //     .tz(timeZone)
  //     .format("DD MMM YYYY hh:mm A");
  //   data.campaignTime = momentTz(data?.campaignTime)
  //     .tz(timeZone)
  //     .format("DD MMM YYYY HH:mm");
  // }
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

export const getWhatsappContactsByCampaignId = async (campaignId: string, query: any, timeZone: string) => {
   let page,
    offset,
    limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }
  let data: any = await db.query.campaignWhatsappContactSchema.findMany({
    where: eq(campaignWhatsappContactSchema.campaignId, campaignId),
    orderBy: [desc(campaignWhatsappContactSchema.createdAt)],
  });
  data = data.map((i: any) => ({
    ...i,
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
  }));

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
  return await db.update(campaignWhatsappContactSchema).set({
    messageId,
    pid,
    messageStatus: status,
    sentAt: new Date(),
    updatedAt: new Date()
  }).where(and(
    eq(campaignWhatsappContactSchema.campaignId, campaignId),
    eq(campaignWhatsappContactSchema.phone, phoneNumber)
  ))
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

export const getWhatsappCampaignByMessageId = async (messageId: string) => {
  return await db.query.campaignWhatsappContactSchema.findFirst({
    where: eq(campaignWhatsappContactSchema.messageId, messageId)
  })
}