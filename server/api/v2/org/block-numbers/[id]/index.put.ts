import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";

export default defineEventHandler(async (event) => {
  try {
    const organizationId = await isOrganizationAdminHandler(event)
    const { id: blockedNumberId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const body = await isValidBodyHandler(event, z.object({
      phoneNumber: z.string().optional(),
      countryCode: z.string().optional()
    }));
    
    if(body?.phoneNumber) {
      const isAlreadyExists = await checkIfBlockedNumberExists(organizationId, body?.phoneNumber, "update", blockedNumberId);
      if(isAlreadyExists) {
        logger.error(`Blocked number already exists: phoneNumber: ${body.phoneNumber}, organizationId: ${organizationId}`)   
        return errorResponse(event, 400, "Phonenumber already exists")
      }
    }
    
    const data = await updateBlockedNumberById(blockedNumberId, body);
    return data;
  } catch (error: any) {
    logger.error(`Update Blocked phonenumber API Error: ${JSON.stringify(error.message)}`);
    return errorResponse(event, 500, "Unable to update blocked number");
  }
})