import { errorResponse } from "~/server/response/error.response"
import { getTtsIntegrationByName, createTtsIntegration } from "~/server/utils/db/tts-integration"
import { z } from "zod"

const zodTtsIntegrationBody = z.object({
  ttsIntegrationName: z.string(),
  provider: z.enum(["elevenlabs", "cartesia", "rime", "neuphonic", "smallest-ai"]),
  metadata: z.record(z.any()).optional(),
});

export type ProviderConfig = {
  validate: (apiKey: string) => Promise<void>;
  errorMessage: string;
};

export const providerConfigMap: Record<string, ProviderConfig> = {
  elevenlabs: {
    validate: async (apiKey: string) => {
      await getElevenlabsModels(apiKey);
    },
    errorMessage: "Invalid elevenlabs API-Key",
  },
  cartesia: {
    validate: async (apiKey: string) => {
      await getCartesiaTtsVoiceList(apiKey)
    },
    errorMessage: "Invalid cartesia API-Key",
  }
};

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const body = await isValidBodyHandler(event, zodTtsIntegrationBody);
  const { provider, metadata, ttsIntegrationName } = body;

  const config = providerConfigMap[provider];
  if (config) {
    try {
      await config.validate(metadata?.apiKey || "");
    } catch {
      return errorResponse(event, 400, config.errorMessage);
    }
  }

  const exists = await getTtsIntegrationByName(ttsIntegrationName, organizationId);
  if (exists) {
    return errorResponse(event, 400, "TTS integration name already exists");
  }

  const data = await createTtsIntegration({
    ...body,
    organizationId,
  });

  return data;
});
