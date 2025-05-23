import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string

    const body = await isValidBodyHandler(event, z.object({
      integrationId: z.string()
    }))

    const integrationData = await getIntegrationById(organizationId, body?.integrationId!)
    if(!integrationData) {
      return errorResponse(event, 404, "CRM Integration data not found")
    }

    if(integrationData?.crm === "zoho-crm") {
      const crmContacts = await newGetLeadOrContactsFromZohoCrm({ integrationData, module: "contacts" });
  
      if(!crmContacts.length) {
        logger.info(`No data found in Zoho CRM - ${integrationData?.id}`)
        return errorResponse(event, 404, "No data found in Zoho CRM")
      }
      
      const mappedCrmDataWithSource = crmContacts.map((item: any) => {
        const crmPhoneOrMobile = item.Mobile || item.Phone;
        const phoneNumber = crmPhoneOrMobile.startsWith('+') ? crmPhoneOrMobile : `+${crmPhoneOrMobile}`
        const phoneNumberDetail = getCountryCodeFromMobileNumber(phoneNumber)

        return {
          name: item?.First_Name,
          email: item?.Email,
          countryCode: `+${phoneNumberDetail?.data?.countryCallingCode}`,
          phoneNumber: phoneNumberDetail?.data?.nationalNumber,
          source: "crm",
          organizationId,
          externalId: body?.integrationId
        }
      })
      
      const phoneNumbers = mappedCrmDataWithSource
        .map((contact: any) => contact.phoneNumber)
        .filter(Boolean);
  
      // Query the database to find existing phone numbers
      const existingContacts = await filterContactsByPhoneNumber(
        organizationId,
        phoneNumbers,
      );
  
      const existingPhoneNumbers = new Set(
        existingContacts.map((contact: any) => contact.phoneNumber),
      );
  
      // Filter unique contacts not in the database
      const uniqueContactsData = mappedCrmDataWithSource.filter(
        (contact: any) => !existingPhoneNumbers.has(contact.phoneNumber),
      );

      if (!uniqueContactsData.length) {
        return errorResponse(event, 400, "No unique phone numbers found to insert");
      }

      await addContact(uniqueContactsData)

      return { status: true };
    } 
   

  } catch (error: any) {
    logger.error(`Contacts - sync CRM API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to sync with CRM's")
  }
})