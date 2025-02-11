import { HttpMethod } from "~/enums/http-method";
import { RequestBuilder } from "../request-builder";
import { updateZohoBillingMetaData } from "../db/adminConfig";
import { logger } from "~/server/logger";

const regenerateAccessToken = async (billingMetaData: any) => {
  try {
    // const authResponse: any = await $fetch(
    //   `https://accounts.zoho.in/oauth/v2/token?client_id=${billingMetaData?.client_id}&grant_type=refresh_token&client_secret=${billingMetaData?.client_secret}&refresh_token=${billingMetaData?.refresh_token}`,
    //   {
    //     method: "POST",
    //   },
    // );

    const authResponse: any = await new RequestBuilder()
    .setBaseURL("https://accounts.zoho.in")
    .setPath("/oauth/v2/token")
    .addQueryParam("client_id", billingMetaData?.client_id)
    .addQueryParam("grant_type", "refresh_token")
    .addQueryParam("client_secret", billingMetaData?.client_secret)
    .addQueryParam("refresh_token", billingMetaData?.refresh_token)
    .setMethod(HttpMethod.POST)
    .execute();

    const updatedMetaData = { ...billingMetaData, ...authResponse };
    await updateZohoBillingMetaData(updatedMetaData);
    return authResponse;
  } catch (error: any) {
    logger.error("Error occurred while regenerating access token:", error);
    throw new Error("Failed to regenerate access token");
  }
};
