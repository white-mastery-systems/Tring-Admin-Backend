import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event))  as string

    const { id: contactGroupId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const formData = await readMultipartFormData(event);
    if (!formData) return errorResponse(event, 500, "Invalid Data");
    
    const fileFields = formData.filter((item) => item.name === "file");
    if (!fileFields.length) return errorResponse(event, 500, "No files uploaded");

    // return fileFields
    let allValidContacts: any[] = [];
    for (const fileField of fileFields) {
      const { filename, data: contactFormData }: any = fileField;
      const fileExtension = filename?.split(".").pop().toLowerCase();
      const validContactData = await parseContactImportFile(
        filename,
        contactFormData,
        fileExtension,
      );
      allValidContacts.push(...validContactData);
    }
    
    const uniqueFileContacts = Array.from(
      new Map(allValidContacts.map(item => [item["Phone Number"], item])).values()
    );
    
    const fileContactNumbers = uniqueFileContacts.map((i)=> i["Phone Number"])
  
    const existingContacts = await filterContactsByPhoneNumber(organizationId, fileContactNumbers)
    
    let contactList = []
    
    if(existingContacts.length) {
      contactList.push(...existingContacts.map((i)=> i.id))
    }
    
    const existingContactNumbers = new Set(existingContacts.map((j) => j.phoneNumber))
    
    const newContactNumbers = uniqueFileContacts.filter((k) => !existingContactNumbers.has(k["Phone Number"]))

    if(newContactNumbers.length) {
      const newContactData: any = newContactNumbers.map((newContact) => {
        const rawCountryCode = newContact["Country Code"]?.toString().trim() || "";
        const formattedCountryCode = rawCountryCode.startsWith("+")
          ? rawCountryCode
          : `+${rawCountryCode}`;
      
        return {
          name: newContact["Name"],
          email: newContact["Email"] || null,
          countryCode: formattedCountryCode,
          phoneNumber: newContact["Phone Number"],
          metadata: newContact["Metadata"] || null,
          verificationId: newContact["Verification Id"] || null,
          organizationId,
          source: "excel",
        };
      });
      
      const newContacts = await addContact(newContactData)
      contactList.push(...newContacts.map((i) => i.id))
    }

    const existingContactGroupLink = await getContactLinksByContactGroupId(contactGroupId, contactList)
        
    const existingContactGroupContactIds = new Set(existingContactGroupLink.map((i) => i.contactId))
    
    const newContactLinks = contactList.filter((i: any) => !existingContactGroupContactIds.has(i))

    if(!newContactLinks.length) {
      return errorResponse(event, 500, "Selected contacts are already linked to this group")
    }
 
    const contactsAndContactGroupsLink: any = newContactLinks.map((item) => ({
      contactId: item,
      contactGroupId,
      organizationId
    }))
    
    const data = await createContactGroupLinks(contactsAndContactGroupsLink)

    return data
    
  } catch(error: any) {
    logger.error(`Contact-group import file API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, error?.message);
  }
})