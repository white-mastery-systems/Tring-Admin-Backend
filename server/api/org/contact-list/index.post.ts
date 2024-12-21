import { errorResponse } from "~/server/response/error.response";
import { contactListContactsSchema } from "~/server/schema/admin";
import { createContactList, createContactListContacts, isBucketNameAlreadyExists } from "~/server/utils/db/contact-list";

const zodInsertContactList = z.object({
   name: z.string(),
   organizationId: z.string().optional(),
   type: z.string(),
   // contactIds: z.array(z.string()).optional(),
   isDefault: z.boolean().optional()
})

export default defineEventHandler(async (event) => {
   const body = await isValidBodyHandler(event, zodInsertContactList)
   const organizationId = event?.context?.user?.organizationId ?? body?.organizationId

   const isAlreadyExists = await isBucketNameAlreadyExists(organizationId, body?.name, body?.type)
   if(isAlreadyExists) return errorResponse(event, 400, "Bucket name already exists")
     
   const data = await createContactList({
     ...body,
     organizationId,
   })
  
   return isValidReturnType(event, data)
})