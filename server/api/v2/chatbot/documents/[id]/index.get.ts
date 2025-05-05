import { stat, readFile } from "node:fs/promises";

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  return serveStatic(event, {
    getContents: (id) => readFile(getDocumentPath(id)),
    getMeta: async (id) => {
      const stats = await stat(getDocumentPath(id)).catch(() => {});

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