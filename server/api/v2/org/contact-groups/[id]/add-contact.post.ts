import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { checkIfContactGroupLinkExists } from "~/server/utils/v2/db/contact-group"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event))  as string
     
    const { id: contactGroupId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const contactPayload = await isValidBodyHandler(
      event,
      contactInfoSchema,
    );

    let checkContactDetail: any = await checkIfContactExists(
      organizationId,
      contactPayload.phoneNumber,
      "insert"
    );
    
    if(!checkContactDetail) {
      checkContactDetail = await addContact({
        ...contactPayload,
        organizationId,
        source: ContactSource.MANUAL
      });

      checkContactDetail = checkContactDetail[0]
    }

    const isAlreadyMapped = await checkIfContactGroupLinkExists(contactGroupId, checkContactDetail.id)

    if(isAlreadyMapped) return errorResponse(event, 400, "Phone number already linked with this contact group")
    
    const data = await createContactGroupLinks({
      contactId: checkContactDetail.id,
      contactGroupId: contactGroupId,
      organizationId,
    })

    return true
 
  } catch (error: any) {
    logger.error(`Contact Group - Add contacts API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to add contact")
  }
}) 