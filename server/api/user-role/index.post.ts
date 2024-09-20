import { isRoleExists } from "~/server/utils/db/user-role";

const bodyValidator = z
  .object({
    role: z.string().optional(),
    permissions: z.array(z.object({})).optional(),
  })

export default defineEventHandler(async(event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const { permissions=[], role }:any = await isValidBodyHandler(event, bodyValidator);

  const isExistsRole = await isRoleExists(role, organizationId)
  if (isExistsRole) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "This role already exists in this organization",
      }),
    );
  }

  const newUserRole = await createUserRole({ organizationId, role, permissions });
  return newUserRole
});
