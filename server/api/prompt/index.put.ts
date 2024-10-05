import { getPrompt } from "~/server/utils/db/prompt"

export default defineEventHandler(async (event) => {
   const body = await readBody(event)

   const data = await updatePrompt({ prompt: body?.rag_bot_prompt })

   return data
})