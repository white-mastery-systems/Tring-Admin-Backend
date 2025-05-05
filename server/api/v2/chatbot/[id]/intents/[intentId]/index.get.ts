
export default defineEventHandler(async (event) => {
  const { intentId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("intentId"),
  );

  const intent = await getIntent(intentId);

  return isValidReturnType(event, intent);
});
