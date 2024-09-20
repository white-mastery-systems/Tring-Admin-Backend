export default defineEventHandler(async(event) => {
  const { id: roleId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
 
  const roleDetails = await getUserRoleById(roleId)

  return roleDetails
});
