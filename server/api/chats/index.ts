import path from "path";
import { fileURLToPath } from "url";
import { logger } from "~/server/server";
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
    period: z.string().optional(),
    botUserName: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
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
  // const logger = useCustomLogger();
  // logger.info("This is an info message");
  // logger.error("This is an error message");

  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader)
    ? timeZoneHeader[0]
    : timeZoneHeader || "Asia/Kolkata";
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const query = await isValidQueryHandler(event, chatQueryValidator);
  logger.log({
    level: "info",
    message: "Hello distributed log files!",
  });

  // console.log("Log file path:", require("path").resolve("combined.log"));
  return await listChats(organizationId, query, timeZone);
});
