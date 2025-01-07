import { errorResponse } from "~/server/response/error.response";

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const formData = await readMultipartFormData(event)
  if (!formData)  return errorResponse(event, 400, "Invalid form-data")

  const integrationId = formData.find(({ name }) => name === "integrationId")?.data.toString()!
  if (!integrationId) return errorResponse(event, 400, "Invalid integrationId")

  const fileData: any = formData.find(({ name }) => name === "file");
  if (!fileData?.data) return errorResponse(event, 400, "Invalid file")

  const integrationData: any = await getIntegrationById(organizationId, integrationId)
  if(!integrationData) return errorResponse(event, 400, "Integration data not found")
  
  const media = await uploadMedia(integrationData?.metadata?.pid, integrationData?.metadata?.access_token, fileData, fileData?.type)
  
  return media
})