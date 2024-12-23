import { getAllChatContactLink, getAllVoiceContactLink, getContactLists } from "~/server/utils/db/contact-list"

const db = useDrizzle()

const zodQueryvalidator = z.object({
  q: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string
  const query = await isValidQueryHandler(event, zodQueryvalidator)

  const contactList = await getContactLists(organizationId, query)

  let page, offset, limit = 0
  if(query.page && query.limit) {
    page = parseInt(query.page) 
    limit = parseInt(query.limit)
    offset = (page - 1) * limit;
  }

  const chatContactsData = await getAllChatContactLink(organizationId)

  const voiceContactsData = await getAllVoiceContactLink(organizationId)
  // return contactList

  const groupedChatByContactListId = chatContactsData.reduce((acc: any, item: any) => {
    if (!acc[item.contactListId]) {
        acc[item.contactListId] = [];
    }
    acc[item.contactListId].push(item.contacts);
    return acc;
  }, {});

  const groupedVoiceByContactListId =  voiceContactsData.reduce((acc: any, item: any) => {
    if (!acc[item.contactListId]) {
        acc[item.contactListId] = [];
    }
    acc[item.contactListId].push(item.contacts);
    return acc;
  }, {});
  
  const allContactListwithContacts = contactList.map((list: any) => {
    const contactCount = list.type === "chat" 
    ? groupedChatByContactListId[list.id] ? groupedChatByContactListId[list.id].length : 0
    : groupedVoiceByContactListId[list.id] ? groupedVoiceByContactListId[list.id].length : 0
    return {
        ...list,
        noOfAudience: contactCount
    };
  });

  if(query?.type) {
    const bucketList = allContactListwithContacts.filter((i) => i.type === query.type)
    return bucketList
  }

  if(query?.page && query?.limit) {
    const paginatedContactList = allContactListwithContacts.slice(offset, offset + limit); 
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(allContactListwithContacts.length/ limit) || 1,
      totalCount: allContactListwithContacts.length,
      data: paginatedContactList
    }
  } else {
      return allContactListwithContacts
  }
})