import { getDocumentById } from "~/server/utils/db/document";

const routeParamValidator = z.object({
  id: z.string().uuid(),
  doc_id: z.string().uuid(),
});
export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: botId, doc_id } = await isValidRouteParamHandler(
    event,
    routeParamValidator,
  );

  let document;
  document = await getDocumentById(doc_id);
  document = document?.status !== "ready" ? null : document;
  document = await isValidReturnType(event, document);

  return updateBotDetails(botId, {
    documentId: document.id,
  });
});
