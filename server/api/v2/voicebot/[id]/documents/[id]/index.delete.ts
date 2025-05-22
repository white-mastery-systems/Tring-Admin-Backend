import { unlink } from "node:fs/promises";
import { deleteVoicebotDocument } from "~/server/utils/db/document";

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  
  const doc = await deleteVoicebotDocument(id);

  try {
    await unlink(getVoicebotDocumentPath(id));
  } catch (err) {
    console.error(err);
  }

  return await isValidReturnType(event, doc);
});
