import { updateUserRoleById } from "~/server/utils/db/user-role";
const db = useDrizzle()

const bodyValidator = z
  .object({
    role: z.string().optional(),
    permissions: z.array(z.object({})).optional(),
  })

  export default defineEventHandler(async(event) => {
    const { id: roleId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
    const body = await isValidBodyHandler(event, bodyValidator); 

    const roleDetails:any = await getUserRoleById(roleId)
    if(!roleDetails){
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: "The role data for the provided ID was not found",
        }),
      );
    }
    if(body.role){
      const isExistsRole = await db.query.authUserRoleSchema.findFirst({
        where: and(
          ne(authUserRoleSchema.id, roleId),
          eq(authUserRoleSchema.role, body.role),
          eq(authUserRoleSchema.organizationId, roleDetails?.organizationId)
        )
      })
      if(isExistsRole){
        return sendError(
          event,
          createError({
            statusCode: 400,
            statusMessage: "This role already exists in this organization",
          }),
        );
      }
    }

    const data = await updateUserRoleById(roleId, {...roleDetails, ...body})
    return data
  });
