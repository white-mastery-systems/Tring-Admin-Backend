import { errorResponse } from "~/server/response/error.response";
import { uploadChatbotDocument } from "~/server/utils/db/document";

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event);
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  // Data Validation
  const formData = await readMultipartFormData(event);

  if (!formData) {
    return errorResponse(event, 400, "Invalid Document Data: No form data was provided. Please ensure all required fields are included in the request.")
  }

  const fileData = formData.find(({ name }) => name === "files");
  if (!fileData?.data) {
     return errorResponse(event, 400, "Invalid Document Data (files): The 'files' field is missing or invalid. Please ensure a valid file is provided.")
  }

  const document = await uploadChatbotDocument(organizationId, formData, fileData, botId)
  
  return document
});