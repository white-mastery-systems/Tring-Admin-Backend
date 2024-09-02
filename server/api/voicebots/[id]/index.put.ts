import { updateVoiceBot } from "~/server/utils/db/voicebots";

const db = useDrizzle()

const zodUpdateVoiceBotSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  domain: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  metaData: z.record(z.any()).optional(), // Assuming metaData is a JSON object with any structure
  llmConfig: z.record(z.any()).optional(), // Assuming llmConfig is a JSON object with any structure
  intents: z.array(z.string()).optional(),
  ivrConfig: z.record(z.any()).optional(),
})

export default defineEventHandler(async(event) => {
  const organizationId = await isOrganizationAdminHandler(event)
  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  
  const body = await isValidBodyHandler(event, zodUpdateVoiceBotSchema)

  const isExists = await db.query.voicebotSchema.findFirst({
    where: and(
      eq(voicebotSchema.organizationId, organizationId),
      ne(voicebotSchema.id, voicebotId),
      ilike(voicebotSchema.name, body?.name)
    )
  })

  if(isExists) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Name already exists",
      }),
    );
  }

  const update = await updateVoiceBot(voicebotId, body)

  return update
})