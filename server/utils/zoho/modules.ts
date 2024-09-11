import { format } from "date-fns";
import { logger } from "~/server/server";

export function getAllPipelinesFromZohoBigin({
  token,
  refreshToken,
  integrationData,
}: {
  token: string;
  refreshToken: String;
  integrationData: any;
}) {
  // "https://www.zohoapis.in/bigin/v2/Pipelines?fields=Sub_Pipeline,Pipeline,Stage",

  const data: any = $fetch<any>(
    "https://www.zohoapis.in/bigin/v1/settings/layouts?module=Pipelines",
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    },
  ).catch((err: any) => {
    console.log(err.data);
    if (!refreshToken) return;
    if (err.status === 401) {
      console.log(err.data);
      return regenearateTokenWithRefreshToken({
        refreshToken: refreshToken,
      }).then(async (data: any) => {
        if (data?.access_token)
          updateIntegrationById(integrationData.id, {
            ...integrationData.metadata,
            access_token: data?.access_token,
          });
        return getAllPipelinesFromZohoBigin({
          token: data?.access_token,
          refreshToken: "",
          integrationData: integrationData,
        });
      });
    }
  });
  return data;
}

export async function getAllSubPipelinesFromZohoBigin({
  token,
  refreshToken,
  integrationData,
}: {
  token: string;
  refreshToken: String;
  integrationData: any;
}) {
  try {
    const data: any = await $fetch<any>(
      "https://www.zohoapis.in/bigin/v2/settings/fields?module=Pipelines",
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );
    console.log({ data }, "DATA FIELDS");
    return data.fields.find((field: any) => field.api_name === "Sub_Pipeline")
      ?.pick_list_values;
  } catch (err: any) {
    console.log(err.data);
    if (!refreshToken) return;
    if (err.status === 401) {
      console.log(err.data);
      return regenearateTokenWithRefreshToken({
        refreshToken: refreshToken,
      }).then(async (data: any) => {
        if (data?.access_token)
          updateIntegrationById(integrationData.id, {
            ...integrationData.metadata,
            access_token: data?.access_token,
          });
        return getAllSubPipelinesFromZohoBigin({
          token: data?.access_token,
          refreshToken: "",
          integrationData: integrationData,
        });
      });
    }
  }
}

export async function generateLeadInZohoBigin({
  token,
  refreshToken,
  body,
  integrationData,
}: {
  token: string;
  refreshToken: String;
  body: any;
  integrationData: any;
}) {
  const fieldMetadata: any = await getFieldMetadataFromZohoBigin({
    token,
    refreshToken,
    body,
    integrationData,
  });
  //
  let bodyData = {
    ...body,
  };

  try {
    fieldMetadata?.fields?.map((field: any) => {
      if (field?.view_type?.create === true) {
        if (bodyData[field?.api_name] === undefined) {
          switch (field.data_type) {
            case "text":
              bodyData[field?.api_name] = "DEFAULT_TRING";
              break;
            case "date":
              const date = new Date();
              bodyData[field?.api_name] = format(new Date(), "yyyy-MM-dd");
              break;
            case "number":
              bodyData[field?.api_name] = 0;
              break;
            case "website":
              bodyData[field?.api_name] = "app.tringlabs.ai";
              break;
            case "email":
              bodyData[field?.api_name] = "app@tringlabs.ai";
              break;
            case "phone":
              bodyData[field?.api_name] = "8888888888";
              break;
            case "currency":
              bodyData[field?.api_name] = 0;
              break;
            default:
              break;
          }
        }
      }
    });
    console.log(JSON.stringify(bodyData), "BODY");
    const generatedPipeline = await $fetch(
      "https://www.zohoapis.in/bigin/v2/Pipelines",
      {
        method: "POST",
        body: { data: [bodyData] },
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );
    console.log(JSON.stringify(generatedPipeline), "PIPELIN");
    return generatedPipeline;
  } catch (err: any) {
    console.log(JSON.stringify(err.data), "ERR");
    if (!refreshToken) return;
    if (err.status === 401) {
      logger.log({
        level: "error",
        message: JSON.stringify(err.data),
      });
      const newlyGeneratedData: any = await regenearateTokenWithRefreshToken({
        refreshToken: refreshToken,
      });
      if (newlyGeneratedData?.access_token)
        updateIntegrationById(integrationData.id, {
          ...integrationData.metadata,
          access_token: newlyGeneratedData?.access_token,
        });
      return generateLeadInZohoBigin({
        token: newlyGeneratedData?.access_token,
        refreshToken: "",
        body: body,
        integrationData: integrationData,
      });
    }
  }
}
export async function getContactById({
  token,
  refreshToken,
  body,
  integrationData,
}: {
  token: string;
  refreshToken: String;
  body: any;
  integrationData: any;
}) {}
export async function generateContactInZohoBigin({
  token,
  refreshToken,
  body,
  integrationData,
}: {
  token: string;
  refreshToken: String;
  body: any;
  integrationData: any;
}) {
  try {
    const data = await $fetch("https://www.zohoapis.in/bigin/v2/Contacts", {
      method: "POST",
      body: { data: [body] },
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    console.log({ data });
    return data;
  } catch (err: any) {
    if (err.status === 400) {
      return {
        data: [
          {
            details: {
              id: err.data.data[0].details?.duplicate_record?.id,
            },
          },
        ],
      };
    }
    if (!refreshToken) return;
    if (err.status === 401) {
      const generatedData: any = await regenearateTokenWithRefreshToken({
        refreshToken: refreshToken,
      });

      if (generatedData?.access_token)
        updateIntegrationById(integrationData.id, {
          ...integrationData.metadata,
          access_token: generatedData?.access_token,
        });
      return generateContactInZohoBigin({
        token: generatedData?.access_token,
        refreshToken: "",
        body: body,
        integrationData: integrationData,
      });
    }
  }
}

export function getFieldMetadataFromZohoBigin({
  token,
  refreshToken,
  body,
  integrationData,
}: {
  token: string;
  refreshToken: String;
  body: any;
  integrationData: any;
}) {
  return $fetch(
    "https://www.zohoapis.in/bigin/v1/settings/fields?module=Pipelines",
    {
      method: "GET",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    },
  ).catch((err) => {
    if (!refreshToken) return;
    if (err.status === 401) {
      regenearateTokenWithRefreshToken({
        refreshToken: refreshToken,
      }).then(async (data: any) => {
        if (data?.access_token)
          updateIntegrationById(integrationData.id, {
            ...integrationData.metadata,
            access_token: data?.access_token,
          });
        return getFieldMetadataFromZohoBigin({
          token: data?.access_token,
          refreshToken: "",
          body: body,
          integrationData: integrationData,
        });
      });
    }
  });
}
//TODO:lead not pushing to zoho if contact exists

//zoho-crm

export function getAllLayoutsFromZohoCRM({
  token,
  refreshToken,
  integrationData,
}: {
  token: string;
  refreshToken: String;
  integrationData: any;
}) {
  return $fetch(
    "https://www.zohoapis.in/crm/v6/settings/layouts?module=Leads",
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    },
  ).catch((err: any) => {
    if (!refreshToken) return;
    if (err.status === 401) {
      return regenearateTokenWithRefreshToken({
        refreshToken: refreshToken,
      }).then(async (data: any) => {
        if (data?.access_token)
          updateIntegrationById(integrationData.id, {
            ...integrationData.metadata,
            access_token: data?.access_token,
          });
        return getAllLayoutsFromZohoCRM({
          token: data?.access_token,
          refreshToken: "",
          integrationData: integrationData,
        });
      });
    }
  });
}
// https://www.zohoapis.in/crm/v6/settings/fields?module=Leads
export function getFieldMetadataFromZohoCRM({
  token,
  refreshToken,
  body,
  integrationData,
}: {
  token: string;
  refreshToken: String;
  body: any;
  integrationData: any;
}) {
  return $fetch("https://www.zohoapis.in/crm/v6/settings/fields?module=Leads", {
    method: "GET",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  }).catch((err) => {
    if (!refreshToken) return;
    if (err.status === 401) {
      regenearateTokenWithRefreshToken({
        refreshToken: refreshToken,
      }).then(async (data: any) => {
        if (data?.access_token)
          updateIntegrationById(integrationData.id, {
            ...integrationData.metadata,
            access_token: data?.access_token,
          });
        return getFieldMetadataFromZohoBigin({
          token: data?.access_token,
          refreshToken: "",
          body: body,
          integrationData: integrationData,
        });
      });
    }
  });
}
export async function generateLeadInZohoCRM({
  token,
  refreshToken,
  body,
  integrationData,
}: {
  token: string;
  refreshToken: String;
  body: any;
  integrationData: any;
}) {
  const fieldMetadata = await getFieldMetadataFromZohoCRM({
    token,
    refreshToken,
    body,
    integrationData,
  });
  //

  let bodyData = {
    ...body,
  };

  fieldMetadata?.fields?.map((field) => {
    if (field?.view_type?.create === true) {
      if (bodyData[field?.api_name] === undefined) {
        switch (field.data_type) {
          case "text":
            bodyData[field?.api_name] = "DEFAULT_TRING";
            break;
          case "date":
            const date = new Date();
            bodyData[field?.api_name] = format(new Date(), "yyyy-MM-dd");
            break;
          case "number":
            bodyData[field?.api_name] = 0;
            break;
          case "website":
            bodyData[field?.api_name] = "app.tringlabs.ai";
            break;
          case "email":
            bodyData[field?.api_name] = "app@tringlabs.ai";
            break;
          case "phone":
            bodyData[field?.api_name] = "8888888888";
            break;
          case "currency":
            bodyData[field?.api_name] = 0;
            break;
          default:
            // bodyData[field?.api_name] = "TRING_DEFAULT";
            break;
        }
      }
    }
  });

  return $fetch("https://www.zohoapis.in/crm/v6/Leads", {
    method: "POST",
    body: { data: [bodyData] },
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  }).catch((err) => {
    if (!refreshToken) return;
    if (err.status === 401) {
      regenearateTokenWithRefreshToken({
        refreshToken: refreshToken,
      }).then(async (data: any) => {
        if (data?.access_token)
          updateIntegrationById(integrationData.id, {
            ...integrationData.metadata,
            access_token: data?.access_token,
          });
        return generateLeadInZohoCRM({
          token: data?.access_token,
          refreshToken: "",
          body: body,
          integrationData: integrationData,
        });
      });
    }
  });
}

export async function getHostedPageDetails({
  token,
  hostedPageId,
  integrationData,
}: {
  token: string;
  hostedPageId: string;
  integrationData: {
    client_id: string;
    client_secret: string;
    refresh_token: string;
    access_token: string;
    organization_id: string;
    code: string;
  };
}) {
  try {
    const response = await $fetch(
      `https://www.zohoapis.in/billing/v1/hostedpages/${hostedPageId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "X-com-zoho-subscriptions-organizationid":
            integrationData?.organization_id,
          "Content-Type": "application/json",
        },
      },
    );
    console.log(
      `https://www.zohoapis.in/billing/v1/hostedpages/${hostedPageId}`,
      JSON.stringify({
        method: "GET",
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "X-com-zoho-subscriptions-organizationid":
            integrationData?.organization_id,
          "Content-Type": "application/json",
        },
      }),
    );

    return response;
  } catch (error) {
    console.error("Error in fetchFromZohoApi:", error);

    if (error instanceof Error) {
      const response = (error as any).response;
      if (response && response.status === 401) {
        const newAuthInfo = await regerateAccessTokenForTringAdmin({
          integrationData,
        });
        // credentials.access_token = newAccessToken;

        return await getHostedPageDetails({
          token: newAuthInfo?.access_token,
          hostedPageId,
          integrationData,
        });
      } else {
        throw error;
      }
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}
const db = useDrizzle();
const regerateAccessTokenForTringAdmin = async ({
  integrationData,
}: {
  integrationData: {
    client_id: string;
    client_secret: string;
    refresh_token: string;
    access_token: string;
    organization_id: string;
    code: string;
  };
}) => {
  try {
    const newAuthInfo: any = await $fetch(
      `https://accounts.zoho.in/oauth/v2/token?client_id=${integrationData?.client_id}&grant_type=refresh_token&client_secret=${integrationData?.client_secret}&refresh_token=${integrationData?.refresh_token}`,
      {
        method: "POST",
      },
    );
    integrationData = { ...integrationData, ...newAuthInfo };
    await db
      .update(adminConfigurationSchema)
      .set({ metaData: integrationData })
      .where(eq(adminConfigurationSchema.id, 1));
    return regerateAccessTokenForTringAdmin({ integrationData });
    // return newAuthInfo;
  } catch (err: any) {}
};

export const cancelSubscriptionFromZohoBilling: any = async ({
  integrationData,
  subscriptionId,
}: {
  integrationData?: {
    client_id: string;
    client_secret: string;
    refresh_token: string;
    access_token: string;
    organization_id: string;
    code: string;
  };
  subscriptionId: string;
}) => {
  if (!integrationData) {
    const zohoData: any = await db.query.adminConfigurationSchema.findFirst({
      where: eq(adminConfigurationSchema.id, 1),
    });
    integrationData = zohoData.metaData;
  }
  try {
    return await $fetch(
      `https://zohoapis.in/billing/v1/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${integrationData?.access_token}`,
        },
      },
    );
  } catch (err: any) {
    if (err.status === 401) {
      const newAuthInfo: any = await $fetch(
        `https://accounts.zoho.in/oauth/v2/token?client_id=${integrationData?.client_id}&grant_type=refresh_token&client_secret=${integrationData?.client_secret}&refresh_token=${integrationData?.refresh_token}`,
        {
          method: "POST",
        },
      );
      integrationData = { ...integrationData, ...newAuthInfo };
      await db
        .update(adminConfigurationSchema)
        .set({ metaData: integrationData })
        .where(eq(adminConfigurationSchema.id, 1));
      return cancelSubscriptionFromZohoBilling({
        integrationData,
        subscriptionId,
      });
    }
  }
};

export const createAddonInZohoBilling: any = async ({
  integrationData,
  body,
}: {
  integrationData?: {
    client_id: string;
    client_secret: string;
    refresh_token: string;
    access_token: string;
    organization_id: string;
    code: string;
  };
  body: any;
}) => {
  if (!integrationData) {
    const zohoData: any = await db.query.adminConfigurationSchema.findFirst({
      where: eq(adminConfigurationSchema.id, 1),
    });
    integrationData = zohoData.metaData;
  }
  if (!integrationData?.organization_id) {
    return createError({
      statusCode: 400,
      statusMessage: "Organization Id is required",
    });
  }
  try {
    console.log({
      body: JSON.stringify(body),
      token: integrationData?.access_token,
      org: integrationData?.organization_id,
    });
    const data = await $fetch(
      `https://www.zohoapis.in/billing/v1/hostedpages/buyonetimeaddon`,
      {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${integrationData?.access_token}`,
          "X-com-zoho-subscriptions-organizationid":
            integrationData?.organization_id,
        },
        body,
      },
    );

    // console.log({ data });
    return data;
  } catch (err: any) {
    console.log(err.data, err.message, "ERROR");
    if (err.status === 401) {
      const newAuthInfo: any = await $fetch(
        `https://accounts.zoho.in/oauth/v2/token?client_id=${integrationData?.client_id}&grant_type=refresh_token&client_secret=${integrationData?.client_secret}&refresh_token=${integrationData?.refresh_token}`,
        {
          method: "POST",
        },
      );
      integrationData = { ...integrationData, ...newAuthInfo };
      await db
        .update(adminConfigurationSchema)
        .set({ metaData: integrationData })
        .where(eq(adminConfigurationSchema.id, 1));
      return createAddonInZohoBilling({
        integrationData,
        body,
      });
    }
  }
};
