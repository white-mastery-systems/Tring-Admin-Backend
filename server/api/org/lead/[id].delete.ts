export default defineEventHandler(async (event) => {
  const { id: leadId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  (await isOrganizationAdminHandler(event)) as string;

  const lead = await deleteLead(leadId);
  return isValidReturnType(event, lead);
});
