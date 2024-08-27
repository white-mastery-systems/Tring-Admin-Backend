import { createTimeline } from "~/server/utils/db/timeline";

const db = useDrizzle();

export default defineEventHandler(async (event) => {
  // name: (schema) =>
  //   schema.name.min(3, "Name Too Short").max(64, "Name Too Long"),
  const zodInsertTimelineSchema = z.object({
    metadata: z.any(),
    orgId: z.string().uuid(),
    userId: z.string().uuid(),
  });

  // Validate Body
  const body = await isValidBodyHandler(event, zodInsertTimelineSchema);
  console.log({ body });

  const bot = await createTimeline({
    org_id: body.orgId,
    user_id: body.userId,
    metadata: body.metadata,
  });

  return bot;
});
