import { format } from "date-fns";

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
  console.log({ token });
  const data: any = $fetch<any>(
    "https://www.zohoapis.in/bigin/v1/settings/layouts?module=Pipelines",
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
  const fieldMetadata = await getFieldMetadataFromZohoBigin({
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

  return $fetch("https://www.zohoapis.in/bigin/v2/Pipelines", {
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
        return generateLeadInZohoBigin({
          token: data?.access_token,
          refreshToken: "",
          body: body,
          integrationData: integrationData,
        });
      });
    }
  });
}

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
  return $fetch("https://www.zohoapis.in/bigin/v2/Contacts", {
    method: "POST",
    body: { data: [body] },
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
        return generateContactInZohoBigin({
          token: data?.access_token,
          refreshToken: "",
          body: body,
          integrationData: integrationData,
        });
      });
    }
  });
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
  console.log({ token });
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
