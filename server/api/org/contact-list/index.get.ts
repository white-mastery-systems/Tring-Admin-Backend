import { getContactLists } from "~/server/utils/db/contact-list"

const db = useDrizzle()

const zodQueryvalidator = z.object({
  q: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const query = await isValidQueryHandler(event, zodQueryvalidator)

  const contactList = await getContactLists(organizationId, query)

  const contacts = await db.query.contactSchema.findMany({
    where: eq(contactSchema.organizationId, organizationId)
  })

  const mapData = contactList.map((item) => {
     let noOfAudience = 0;
     const audience = contacts.filter((j) => j.contactListId === item.id).length
     if(audience) {
       noOfAudience = audience
     }
     return {
      ...item,
      noOfAudience
     }
  })

  return mapData
})