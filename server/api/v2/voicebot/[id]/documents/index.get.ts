import { listVoicebotDocument } from "~/server/utils/db/document";

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);

  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";

  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  return await listVoicebotDocument(voicebotId, timeZone);
});