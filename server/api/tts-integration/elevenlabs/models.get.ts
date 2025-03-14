export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const query = await isValidQueryHandler(event, z.object({
    apiKey: z.string(),
    language: z.string().optional()
  }))

  let data: any = await getElevenlabsModels(query?.apiKey)
  if(query?.language) {
    data = data.filter((i: any) => i.languages.some((j: any)=> j.name === query?.language))
  }
  return data
})