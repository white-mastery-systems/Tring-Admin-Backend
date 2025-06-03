import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const { id: blockedNumberId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const data = await getBlockedNumberById(blockedNumberId);
    
    return isValidReturnType(event, data)
  } catch (error: any) {
    logger.error(`Get Blocked Number By Id API Error: ${JSON.stringify(error.message)}`);
    return errorResponse(event, 500, "Unable to fetch blocked number");
  }
})