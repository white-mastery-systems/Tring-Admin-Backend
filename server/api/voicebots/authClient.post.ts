const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(
    event,
    z.object({
      mobile: z.string(),
      countryCode: z.string(),
    }).parse,
  );

  // console.log({ body })

  const voiceBotDetail: any = await db.query.voicebotSchema.findFirst({
    where: eq(voicebotSchema.mobile, body?.mobile),
  });

  if (!voiceBotDetail) {
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Mobile number does not exist",
      }),
    );
  }

  if (!voiceBotDetail.active) {
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Bot is not active",
      }),
    );
  }

  // check the plan-code of the orgaination
  const voicebotPlan = await db.query.organizationSchema.findFirst({
    where: eq(organizationSchema.id, voiceBotDetail.organizationId),
  });

  // console.log({ voicebotPlan })
  if (voicebotPlan.voicePlanCode === "voice_free") {
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "The user was a free plan",
      }),
    );
  }
  //TODO - add extra and normal quota validation
  return {
    bot_id: voiceBotDetail.id,
    organization_id: voiceBotDetail.organizationId,
    stt_config: voiceBotDetail.speechToTextConfig,
    tts_config: voiceBotDetail.textToSpeechConfig,
    llm_config: voiceBotDetail.llmConfig,
    client_config: voiceBotDetail.clientConfig,
    language: voiceBotDetail.identityManagement?.language,
  };
});
