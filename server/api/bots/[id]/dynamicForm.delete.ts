

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, z.object({
    fields: z.array(z.any())
  }))

  const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const dynamicFormUpdate = await updateBotDetails(botId, { formStructure: body })
   
  return isValidReturnType(event, dynamicFormUpdate)
})