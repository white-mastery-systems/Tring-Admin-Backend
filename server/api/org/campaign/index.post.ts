import { checkCampaignNameExist } from "~/server/utils/db/campaign";
import { errorResponse } from "~/server/response/error.response";
import { createVoicebotSchedular } from "~/server/utils/db/voicebots";
import { getContactsByChatbotBucketId } from "~/server/utils/db/contact-list";
const zodInsertCampaign = z.object({
  campaignName: z.string(),
  contactMethod: z.string(),
  bucketId: z.string(),
  botConfig: z.object({
    botId: z.string().optional(),
    workingStartTime: z.string().optional(),
    workingEndTime: z.string().optional(),
    callsPerTrigger: z.string().optional(),
    campaignDate: z.string().optional(),
    campaignTime: z.string().optional(),
    templateId: z.string().optional(),
  }),
});

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event) as string

  const body = await isValidBodyHandler(event, zodInsertCampaign)

  const isAlreadyExist = await checkCampaignNameExist(organizationId, body?.campaignName)

  if(isAlreadyExist) return errorResponse(event, 400, "Campaign name already exists")

  const data = await createCampaign({
    ...body,
    organizationId
  })

  if(data.contactMethod === "voice") {
    // fetch voiceContactIds of bucket
    const voiceContactList = await getContactsByVoiceBucketId(data?.bucketId)

    const voiceContactIds = voiceContactList.map((i) => i.contactId)

    const mapVoiceContactWithSchedular = voiceContactIds.map((contactId) => {
      return {
        campaignId: data.id,
        bucketId: data?.bucketId!,
        contactId: contactId,
        botId: data?.botConfig?.botId,
        organizationId: organizationId,
      }
    })
    // create campaign data in schedular table
    await createVoicebotSchedular(mapVoiceContactWithSchedular)
  }

  if(data.contactMethod === "whatsapp") {
    const chatbotContactList = await getContactsByChatbotBucketId(data?.bucketId)
    const templateData = await getTemplateById(data?.botConfig?.templateId)
    console.log(templateData, "templateData")

    // create campaign data in schedular table
    scheduleEvent(
      data?.botConfig?.campaignDate,
      data?.botConfig?.campaignTime,
      chatbotContactList,
      body,
      templateData[0],
    );
    console.log("WhatsApp campaign scheduled successfully");
  }
  return data
});



// export default defineEventHandler(async (event) => {
//   const organizationId = (await isOrganizationAdminHandler(event)) as string;

//   const body: any = await isValidBodyHandler(event, zodInsertCampaign);

//   const data = await createCampaign({
//     ...body,
//     organizationId,
//   });

//   if (!data) {
//     return { status: false, message: "Failed to create" };
//   }
//   // const contactList = await db
//   //   .select()
//   //   .from(contactListContactsSchema)
//   //   .where(eq(contactListContactsSchema.contactListId, body.contactListId))
//   //   .leftJoin(
//   //     contactSchema,
//   //     eq(contactSchema.id, contactListContactsSchema.contactId),
//   //   );
//   const contactList = await db.query.contactListContactsSch
// ema.findMany({
//     with: {
//       contacts: true,
//     },
//     where: eq(contactListContactsSchema.contactListId, body.contactListId),
//   });
//   console.log(contactList, "contactList");
//   // return contactList;
//   const templateData = await db
//     .select()
//     .from(templateSchema)
//     .where(eq(templateSchema.id, data.templateId))
//     .leftJoin(
//       integrationSchema,
//       eq(integrationSchema.id, templateSchema.integrationId),
//     );
//   console.log(templateData, "templateData");
//   scheduleEvent(
//     data?.campaignDate,
//     data?.campaignTime,
//     contactList,
//     body,
//     templateData[0],
//   );
//   // const job = await campaignQueue.add(
//   //   {
//   //     campaignId: data?.id,
//   //     campaignDate: data?.campaignDate,
//   //     campaignTime: data?.campaignTime,
//   //     contactList,
//   //     body,
//   //     templateData: templateData[0],
//   //   },
//   //   // { delay: 5000 }
//   // );
//   // logger.info(
//   //   `Job (id: ${job.id}, CampaignId - ${data?.id}) added at: ${new Date()}`,
//   // );

//   return data;
// });
