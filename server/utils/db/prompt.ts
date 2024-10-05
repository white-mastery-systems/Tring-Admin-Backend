const db = useDrizzle()

export const createPrompt = async(prompt: any) => {
  return (await db.insert(promptSchema).values(prompt).returning())[0]
}

export const getPrompt = async () => {
  const data = await db.query.promptSchema.findFirst()
  return data
}

export const updatePrompt = async (prompt: any) => {
  return (
    await db.update(promptSchema)
    .set({
      ...prompt,
      updatedAt: new Date()
    }).returning()
  )[0]
}