import { getPrompt } from "~/server/utils/db/prompt"

export default defineEventHandler(async (event) => {
  const data = await getPrompt()
  return data
})