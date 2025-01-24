import { writeFile } from "node:fs/promises";
import { v4 as uuid } from "uuid";

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
        statusMessage:
          "Invalid Logo: The logo data is missing or in an incorrect format. Please provide a valid logo.",
      }),
    );
  }

  const baseUrl = getHeader(event, "origin");

  const fileData = formData.find(({ name }) => name === "logo");
  if (!fileData?.data)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Invalid Document Data: The document data is missing or corrupted. Please upload a valid document.",
      }),
    );

  const logoPathId = uuid();
  const ext = fileData.filename?.split(".").pop() || "png";
  const logoPath = getLogoPath(logoPathId, ext);
  await writeFile(logoPath, fileData.data);

  let bot = await getBotDetailsNoCache(botId);
  bot = await isValidReturnType(event, bot);

  const metadata = bot.metadata as Record<string, any>;

  const updatedBot = await updateBotDetails(botId, {
    metadata: {
      ...metadata,
      ui: {
        ...metadata.ui,
        logo: `${baseUrl}/logo/${logoPathId}.${ext}`,
      },
    },
  });

  return isValidReturnType(event, updatedBot);
});
