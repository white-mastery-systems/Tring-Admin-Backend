import { addDynamicFormValues } from "~/server/utils/db/bot"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)  
  const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"))  
  const data = await addDynamicFormValues({
   ...body,
   botId
  })  
  return data
})