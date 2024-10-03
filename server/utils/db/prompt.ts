const db = useDrizzle()

export const createPrompt = async(prompt: any) => {
  return (await db.insert(promptSchema).values(prompt).returning())[0]
}

export const getPrompt = async () => {
  const data = await db.query.promptSchema.findFirst()
  return data
}