const zodUpdateContactList = z.object({
  name: z.string().optional()
})

const db = useDrizzle()

export default defineEventHandler(async (event) => {
   await isOrganizationAdminHandler(event)

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
        statusMessage: "Name already exists",
      }),
    );
   }

  const update = await updateContactList(contactListId, body)

  return update;
})