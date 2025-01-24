import { isChatContactsAlreadyExists, isVoicebotContactsAlreadyExists, updateVoicebotContacts } from "~/server/utils/db/contacts"

const zodChatUpdateContacts = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  countryCode: z.string().optional(),
  phone: z.string().optional()
})

const zodVoiceUpdateContacts = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  metadata: z.string().optional(),
  countryCode: z.string().optional(),
  verificationId: z.string().optional(),
  organizationId: z.string().optional()
})

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const query = await isValidQueryHandler(event, z.object({
    type: z.string()
  }))

  const { contactId } = await isValidRouteParamHandler(event, checkPayloadId("contactId"))

  const body: any = query.type === "chat" 
   ? await isValidBodyHandler(event, zodChatUpdateContacts)
   : await isValidBodyHandler(event, zodVoiceUpdateContacts)

  const isAlreadyExists = query.type === "chat"
  ? await isChatContactsAlreadyExists(contactId, body?.phone)
  : await isVoicebotContactsAlreadyExists(contactId, body?.phone)
  
  if (isAlreadyExists) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Phone Number Already Exists: The provided phone number is already registered. Please use a different phone number or check for duplicates.",
      }),
    );
  }
  
  const data = query.type === "chat" 
  ? await updateContacts(contactId, body)
  : await updateVoicebotContacts(contactId, body)

  return data
})