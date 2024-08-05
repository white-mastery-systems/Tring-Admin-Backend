import { stat, readFile } from "node:fs/promises";

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { doc_id } = await isValidRouteParamHandler(
    event,
    checkPayloadId("doc_id"),
  );

  return serveStatic(event, {
    getContents: (id) => readFile(getDocumentPath(doc_id)),
    getMeta: async (id) => {
      const stats = await stat(getDocumentPath(doc_id)).catch(() => {});

      if (!stats || !stats.isFile()) {
        return;
      }

      return {
        size: stats.size,
        mtime: stats.mtimeMs,
      };
    },
  });
});
