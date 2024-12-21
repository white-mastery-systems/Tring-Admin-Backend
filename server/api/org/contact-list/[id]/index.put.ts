import { inArray } from 'drizzle-orm'
import { contactListContactsSchema } from '~/server/schema/admin'

const db = useDrizzle()

const zodUpdateContactList = z.object({
  name: z.string().optional(),
  contactIds: z.array(z.string()).optional(),
  removedContactIds: z.array(z.string()).optional()
})

export default defineEventHandler(async (event) => {
   const organizationId = (await isOrganizationAdminHandler(event)) as string

   const { id: contactListId} = await isValidRouteParamHandler(event, checkPayloadId("id"))

   const body: any = await isValidBodyHandler(event, zodUpdateContactList)

   const isAlreadyExists = await db.query.contactListSchema.findFirst({
      where: and(
         ne(contactListSchema.id, contactListId),
         ilike(contactListSchema.name, body.name)
      )
   })
   if(isAlreadyExists) {
      return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Bucket ame already exists",
      }),
    );
   }

  const update = await updateContactList(contactListId, body)

  if(update) {
    const existingContactsLink = await db.select()
      .from(contactListContactsSchema)
      .where(
        and(
          inArray(contactListContactsSchema.contactId, body?.contactIds),
          eq(contactListContactsSchema.contactListId, contactListId)
        )
      );

    const existingContactIds = new Set(existingContactsLink.map((item: any) => item.contactId ));

    // Filter out the parsed data with unique phone numbers not in the database
    const uniqueContactsData = body.contactIds
    .filter((contact: any) => !existingContactIds.has(contact))
    .map((item: any) => ({
       contactListId: contactListId,
       contactId: item,
       organizationId,
    }))
    // console.log({ uniqueContactsData })
    if(uniqueContactsData?.length) {
      await createContactListContacts(uniqueContactsData)
    }
    if(body.removedContactIds.length) {
      await db
      .delete(contactListContactsSchema)
      .where(and(
        eq(contactListContactsSchema.contactListId, contactListId),
        inArray(contactListContactsSchema.contactId, body.removedContactIds))
      )
    }
  }

  return update;
})