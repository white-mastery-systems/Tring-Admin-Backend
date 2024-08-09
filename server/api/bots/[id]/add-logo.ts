import { writeFile } from "node:fs/promises";
import { v4 as uuid } from "uuid";

const conf = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  // Data Validation
  const formData = await readMultipartFormData(event);
  if (!formData) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid Logo",
      }),
    );
  }

  const fileData = formData.find(({ name }) => name === "logo");
  if (!fileData?.data)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid Document Data",
      }),
    );

  const logoPath = getLogoPath(uuid());
  await writeFile(logoPath, fileData.data);

  let bot = await getBotDetailsNoCache(botId);
  bot = await isValidReturnType(event, bot);

  const metadata = bot.metadata as Record<string, any>;

  const updatedBot = await updateBotDetails(botId, {
    metadata: {
      ...metadata,
      ui: {
        ...metadata.ui,
        logo: logoPath,
      },
    },
  });

  return isValidReturnType(event, updatedBot);
});
