import { listChats } from "~/server/utils/db/chats";

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const query = getQuery(event);
  return await listChats(organizationId, query);
});
