import { listVoicebotDocument } from "~/server/utils/db/document";

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  return await listVoicebotDocument(voicebotId);
});