import { isRoleExists } from "~/server/utils/db/user-role";

const bodyValidator = z
  .object({
    name: z.string().optional(),
    permissions: z.record(z.any()).optional(),
  })

export default defineEventHandler(async(event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const { permissions, name }:any = await isValidBodyHandler(event, bodyValidator);
 
  const isExistsRole = await isRoleExists(name, organizationId)
  if (isExistsRole) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Role Already Exists: This role is already assigned within the organization. Please choose a different role name.",
      }),
    );
  }

  const newUserRole = await createUserRole({ organizationId, name, permissions });
  return newUserRole
});
