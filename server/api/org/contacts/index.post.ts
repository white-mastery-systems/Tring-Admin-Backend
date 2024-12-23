import { errorResponse } from "~/server/response/error.response"
import { checkChatContacts, checkVoiceContacts, createContacts, createVoicebotContacts } from "~/server/utils/db/contacts"

export const zodChatContacts = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  countryCode: z.string().optional(), 
  phone: z.string(),
  organizationId: z.string().optional()
})

export const zodVoiceContacts = z.object({
  name: z.string().optional(),
  phone: z.string(),
  metadata: z.string().optional(),
  countryCode: z.string().optional(),
  verificationId: z.string().optional(),
  organizationId: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const query =  await isValidQueryHandler(event, z.object({
    type: z.string()
  }))
  const body = query.type === "chat"
   ? await isValidBodyHandler(event, zodChatContacts) 
   : await isValidBodyHandler(event, zodVoiceContacts)

  const organizationId = event?.context?.user?.organizationId ?? body.organizationId

  const isAlreadyExists = query.type === "chat" 
  ? await checkChatContacts(organizationId, body?.phone)
  : await checkVoiceContacts(organizationId, body?.phone)

  if(isAlreadyExists) {
    return errorResponse(event, 400, "phone number already exists")
  }

  const data = query.type === "chat" 
  ? await createContacts({
    ...body,
    organizationId: organizationId,
  }) 
  : await createVoicebotContacts({
    ...body,
    organizationId: organizationId,
  })

  return data
})