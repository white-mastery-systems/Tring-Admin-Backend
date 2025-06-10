import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { uploadChatbotDocument } from "~/server/utils/db/document"

export default defineEventHandler(async (event) => { 
  try {
    const organizationId = await isOrganizationAdminHandler(event)

    // Data Validation
    const formData = await readMultipartFormData(event);
   
    if (!formData) {
      return errorResponse(event, 400, "Invalid Document Data: No form data was provided. Please ensure all required fields are included in the request.")
    }
    
    const fileData = formData.find(({ name }) => name === "files");
    const fileName = formData[0].filename!
    if (!fileData?.data) {
      return errorResponse(event, 400, "Invalid Document Data (files): The 'files' field is missing or invalid. Please ensure a valid file is provided.")
    }
    
    const document = await uploadChatbotDocument(organizationId, fileData, fileName)

    return document
   
  } catch (error: any) {
    logger.error(`Chatbot upload document API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to upload document")
  }
})
