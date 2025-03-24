import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { buyPhoneNumberForPlivoSubAccount } from "~/server/utils/plivo"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = await isOrganizationAdminHandler(event)
    const adminDetails = await getAdminByOrgId(organizationId)

    // Create a sub-account in Plivo 
    const createSubAccount: any = await createSubAccountInPlivo({
      name: adminDetails?.email!
    })
    if(!createSubAccount?.authId && !createSubAccount.authToken) {
      logger.error(`Unable to create a sub-account in plivo for organizationId - ${organizationId}`)
      return errorResponse(event, 500, "Unable to create a sub-account in plivo")
    }

    // create plivo sub-account credentials in cloud-telephony
    await createNumberIntegration({
      ivrIntegrationName: adminDetails?.email!,
      provider: "plivo",
      metadata: {
        authId: createSubAccount?.authId,
        authToken: createSubAccount.authToken
      },
      organizationId
    })

    // Get the plivo sub-account PhoneNumbers List
    const plivoSubAccountPhoneNumberList = await listPlivoSubAccountPhoneNumbers({
      subAccountAuthId: createSubAccount.authId,
      subAccountAuthToken: createSubAccount.authToken,
      country: "US",
      page: "1",
      limit: "1"
    })
    if(!plivoSubAccountPhoneNumberList.length) {
       logger.error(`Unable to get plivo sub-account phoneNumbers for organizationId - ${organizationId}`)
       return errorResponse(event, 500, "Unable to fetch sub-account phonenumbers in Plivo")
    }

    // Buy a phoneNumber for sub-account in plivo 
    const data: any = await buyPhoneNumberForPlivoSubAccount({ 
      subAccountAuthId: createSubAccount.authId, 
      phoneNumber: plivoSubAccountPhoneNumberList[0]
    })
    if(!data.numbers) {
      logger.error(`Unable to buy a phoneNumber in plivo for organizationId - ${organizationId}`)
      return errorResponse(event, 500, "Unable to buy a phoneNumber in plivo")
    }
    
    return {
      phoneNumber: data?.numbers?.number
    }
  } catch (error: any) {
    logger.error(`Plivo Buy PhoneNumnber API Error: ${JSON.stringify(error.message)}}`)
    return errorResponse(event, 500, "Unable to buy a phonenumber in plivo")
  }
})