import { createVoicebot } from "~/server/utils/db/voicebots";

const db = useDrizzle()

export const zodVoicebotSchema = z.object({
  name: z.string(),
})

export default defineEventHandler(async(event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const body = await isValidBodyHandler(event, zodVoicebotSchema)

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

  const voiceBot = await createVoicebot({
    ...body,
    organizationId,
  })

   return isValidReturnType(event, voiceBot);
})