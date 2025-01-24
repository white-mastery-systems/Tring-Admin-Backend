import { updateUserRoleById } from "~/server/utils/db/user-role";
const db = useDrizzle()

const bodyValidator = z
  .object({
    name: z.string().optional(),
    permissions: z.record(z.any()).optional(),
  })

export default defineEventHandler(async(event) => {
  const { id: roleId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
  const body = await isValidBodyHandler(event, bodyValidator); 

  const roleDetails:any = await getUserRoleById(roleId)
  if (!roleDetails) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Role Not Found: The role data for the provided ID could not be located. Please verify the ID and try again.",
      }),
    );
  }
  if(body.name){
    const isExistsRole = await db.query.authUserRoleSchema.findFirst({
      where: and(
        ne(authUserRoleSchema.id, roleId),
        eq(authUserRoleSchema.name, body.name),
        eq(authUserRoleSchema.organizationId, roleDetails?.organizationId)
      )
    })
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
  }

  const data = await updateUserRoleById(roleId, {...roleDetails, ...body})
  return data
});
