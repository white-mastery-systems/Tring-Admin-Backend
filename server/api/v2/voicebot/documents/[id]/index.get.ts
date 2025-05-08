import { stat, readFile } from "node:fs/promises";
import { logger } from "~/server/logger";
import { getVoicebotDocumentPath } from "~/server/utils/db/document";

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event);
    const { id: doc_id } = await isValidRouteParamHandler(
      event,
      checkPayloadId("id"),
    );
    console.log({ docId: doc_id })
  
    return serveStatic(event, {
      getContents: (id) => readFile(getVoicebotDocumentPath(doc_id)),
      getMeta: async (id) => {
        const stats = await stat(getVoicebotDocumentPath(doc_id)).catch(() => {});
  
        if (!stats || !stats.isFile()) {
          return;
        }
  
        return {
          size: stats.size,
          mtime: stats.mtimeMs,
        };
      },
    })
  } catch (error: any) {
    logger.error(`Voicebot Document download API Error: ${JSON.stringify(error.message)}`)
  }
})