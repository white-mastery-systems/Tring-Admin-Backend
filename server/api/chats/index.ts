import path from "path";
import { fileURLToPath } from "url";
import { logger } from "~/server/logger";
import { listChats } from "~/server/utils/db/chats";

const chatQueryValidator = z
  .object({
    botId: z.string().optional(),
    from: z
      .string()
      .datetime({ offset: true })
      .nullish()
      .transform((val) => (val ? new Date(val) : null)),
    to: z
      .string()
      .datetime({ offset: true })
      .nullish()
      .transform((val) => (val ? new Date(val) : null)),
    q: z.string().optional(),
    channel: z.string().optional(),
    country: z.string().optional(),
    period: z.string().optional(),
    botUserName: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    outcome: z.string().optional(),
    mode: z.string().optional(),
    export: z.string().default("false")
  })
  .refine(
    (data) => {
      if (data.from === null && data.to === null) {
        return true;
      }
      return data.from !== null && data.to !== null;
    },
    {
      message:
        "Both 'from' and 'to' must be present if either is provided, or both must be omitted.",
    },
  );
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineEventHandler(async (event) => {

  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader)
    ? timeZoneHeader[0]
    : timeZoneHeader || "Asia/Kolkata";
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const query = await isValidQueryHandler(event, chatQueryValidator);
  return await listChats(organizationId, query, timeZone);
});
