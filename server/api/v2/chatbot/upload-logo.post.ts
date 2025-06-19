import { writeFile } from "node:fs/promises";
import { v4 as uuid } from "uuid";
import { existsSync, mkdirSync } from 'node:fs';
import { join } from "node:path";
import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event);

    // Data Validation
    const formData = await readMultipartFormData(event);
    if (!formData) {
      return errorResponse(event, 400,  "Invalid Logo: The logo data is missing or in an incorrect format. Please provide a valid logo.")
    }

    const baseUrl = getHeader(event, "origin");
  
    const fileData = formData.find(({ name }) => name === "logo");
    if (!fileData?.data) return errorResponse(event, 400, "Invalid Document Data: The document data is missing or corrupted. Please upload a valid document.")
    
    const uploadDir = join(process.cwd(), 'assets', 'logo');
  
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
    }
  
    const logoPathId = uuid();
    const ext = fileData.filename?.split(".").pop() || "png";
  
    const logoPath = `./assets/logo/${logoPathId}.${ext}`
    // getLogoPath(logoPathId, ext);
    await writeFile(logoPath, fileData.data);
  
    const logo = {
      name: fileData.filename,
      size: fileData.data.length,
      type: fileData.type,
      url: `/logo/${logoPathId}.${ext}`,
    }
  
    return logo

  } catch (error: any) {
    logger.error(`Chatbot upload logo API error: ${error.message}`)
    return errorResponse(event, 500, "Failed upload logo")
  }
});
