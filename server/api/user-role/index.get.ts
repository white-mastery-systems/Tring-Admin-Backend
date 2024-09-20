import { getAllUserRolesByOrgId } from "~/server/utils/db/user-role";

const zodQueryValidator = z.object({
  q: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
})

export default defineEventHandler(async(event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string
  const query = await isValidQueryHandler(event, zodQueryValidator) 
 
  const roleList = await getAllUserRolesByOrgId(organizationId, query)
  return roleList
});
