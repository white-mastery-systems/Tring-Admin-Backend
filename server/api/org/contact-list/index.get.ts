import { getContactLists } from "~/server/utils/db/contact-list"

const db = useDrizzle()

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const contactList = await getContactLists(organizationId)

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