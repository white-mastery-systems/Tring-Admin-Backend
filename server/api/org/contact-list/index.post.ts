import { createContactList } from "~/server/utils/db/contact-list";

const zodInsertContactList = z.object({
   name: z.string(),
   organizationId: z.string().optional(),
   contactIds: z.array(z.string()).optional(),
   isDefault: z.boolean().optional()
})

const db = useDrizzle()

export default defineEventHandler(async (event) => {
   // const organizationId = (await isOrganizationAdminHandler(event)) as string;
   
   const body = await isValidBodyHandler(event, zodInsertContactList)
   // console.log({ event: event?.context?.user })
   const organizationId = event?.context?.user?.organizationId ?? body?.organizationId

   const isAlreadyExists = await db.query.contactListSchema.findFirst({
      where: and(
         eq(contactListSchema.organizationId, organizationId),
         ilike(contactListSchema.name, body.name)
      )
   })
   if(isAlreadyExists) {
      return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Name already exists",
      }),
    );
   }

   const data = await createContactList({
     ...body,
     organizationId,
   })

   return isValidReturnType(event, data)
})