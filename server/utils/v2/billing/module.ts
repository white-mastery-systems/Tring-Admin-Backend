import { HttpMethod } from "~/enums/http-method";
import { RequestBuilder } from "../requestBuilder";
import { updateZohoBillingMetaData } from "../db/adminConfig";
import { logger } from "~/server/logger";
import stateCodeMap from "../../../../assets/state.json";

export const retrieveNewAccessToken = async (metadata: any) => {
  try {
    const refreshTokenResponse: any = await new RequestBuilder()
      .setBaseURL("https://accounts.zoho.in")
      .setPath("/oauth/v2/token")
      .addQueryParam("client_id", metadata.client_id)
      .addQueryParam("grant_type", "refresh_token")
      .addQueryParam("client_secret", metadata.client_secret)
      .addQueryParam("refresh_token", metadata.refresh_token)
      .setMethod(HttpMethod.POST)
      .execute();

    const updatedMetadata = { ...metadata, ...refreshTokenResponse };
    await updateZohoBillingMetaData(updatedMetadata);

    return refreshTokenResponse;
  } catch (error: any) {
    logger.error("Failed to regenerate access token:", error);
    throw new Error("Failed to regenerate access token");
  }
};

export const retrieveStateCodeByName = (stateName: string): string | null => {
  const foundState = stateCodeMap.find((state) => state.name === stateName);
  return foundState?.state_code ?? null;
};
