import { SelectVoiceBotLead } from "~/server/schema/voicebot";
import { getBotUserById } from "~/server/utils/db/bot-user";
import { createVoiceBotLead, getVoicebot } from "~/server/utils/db/voicebots";

const db = useDrizzle()
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  const query = await isValidQueryHandler(
    event,
    z.object({ userId: z.string().optional() }),
  );
  console.log({ query });

  const botUserId = getCookie(event, "user_id") ?? query?.userId;
  if (!botUserId)
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Invalid Request" }),
    );

  const voiceBotDetails = await getVoicebot(voicebotId)
  if (!voiceBotDetails)
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Invalid Bot" }),
    );

  const botUserDetails = await getBotUserById(botUserId, voiceBotDetails.organizationId)
  if (!botUserDetails)
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Invalid User" }),
    );
  let lead : SelectVoiceBotLead
  
  try {
    lead = await createVoiceBotLead({
      voicebotId,
      botUserId,
      organizationId: voiceBotDetails.organizationId,
    });
  } catch (err) {
    console.log("Duplicate voicebot Lead: ", err);
  }

  const bucketList = await db.query.contactListSchema.findFirst({
    where: and(
      eq(contactListSchema.organizationId, voiceBotDetails.organizationId),
      eq(contactListSchema.isDefault, true)
    )
  })
  console.log({ bucketList })
  if(bucketList) {
    let firstName = botUserDetails?.name;
    let lastName = "";
    if (firstName?.includes(" ")) {
      firstName = firstName?.split(" ")[0];
      lastName = firstName?.split(" ")[1];
    }
    const contactsBody = {
      firstName,
      lastName,
      countryCode: botUserDetails.countryCode,
      phone: botUserDetails.mobile,
      organizationId: voiceBotDetails.organizationId,
      contactListId: bucketList?.id
    }
    await createContacts(contactsBody)
  }
  
  const body = await isValidBodyHandler(
    event,
    z.object({ note: z.string().default("") }),
  );

  $fetch(`/api/voicebots/${voicebotId}/generate-voicebot-leads`, {
    baseURL: config.adminBaseUrl,
    method: "POST",
    body: {
      note: body.note,
      botUserDetails,
    },
  });
  return "Voicebot leads are created";
})