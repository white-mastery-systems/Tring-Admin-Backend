import { createContactList } from "~/server/utils/db/contact-list";

const zodInsertContactList = z.object({
   name: z.string()
})

export default defineEventHandler(async (event) => {
   const organizationId = (await isOrganizationAdminHandler(event)) as string;

   const body = await isValidBodyHandler(event, zodInsertContactList)

   const data = await createContactList({
     ...body,
     organizationId,
   })

   return isValidReturnType(event, data)
})