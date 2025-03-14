export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)
  
  const query = await isValidQueryHandler(event, z.object({
    apiKey: z.string()
  }))

  let data: any = await getElevenlabsVoices(query?.apiKey)

  return data
})