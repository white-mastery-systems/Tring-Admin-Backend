import { createVoicebot } from "~/server/utils/db/voicebots";

const db = useDrizzle()

export const zodVoicebotSchema = z.object({
  name: z.string().optional(),
})

export default defineEventHandler(async(event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const body = await isValidBodyHandler(event, zodVoicebotSchema)

  const orgDetails = await getOrganizationById(organizationId)

  const randomBotName = generateRandomBotName(orgDetails?.name!)

  if(body.name) {
    const isExists = await db.query.voicebotSchema.findFirst({
      where: and(
        eq(voicebotSchema.organizationId, organizationId),
        ilike(voicebotSchema.name, body.name)
      )
    })

    if (isExists) {
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage:
            "Name Already Taken: The provided name already exists. Please choose a different name.",
        }),
      );
    }
  }
  
  const voiceBot = await createVoicebot({
    name: body?.name ?? randomBotName,
    organizationId,
  })

  return isValidReturnType(event, voiceBot);
})

const generateRandomBotName = (orgName: string) => {
  const defaultName = `${orgName} - voice bot - ${Math.floor(100 + Math.random() * 900)}`;
  return defaultName
}