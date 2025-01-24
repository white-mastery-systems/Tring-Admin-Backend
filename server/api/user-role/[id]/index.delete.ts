import { deleteUserRoleById } from "~/server/utils/db/user-role";

export default defineEventHandler(async(event) => {
  const { id: roleId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

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

  const data = await deleteUserRoleById(roleId)
  return data
  });
