export function getAllPipelinesFromZohoBigin({
  token,
  refreshToken,
  integrationData,
}: {
  token: string;
  refreshToken: String;
  integrationData: any;
}) {
  const data = $fetch(
    "https://www.zohoapis.in/bigin/v2/Pipelines?fields=Sub_Pipeline,Pipeline,Stage",
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    },
  ).catch((err: any) => {
    console.log("err", JSON.stringify(err.data));
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

export function generateLeadInZohoBigin({
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
  console.log({ body: JSON.stringify(body) });
  return $fetch("https://www.zohoapis.in/bigin/v2/Pipelines", {
    method: "POST",
    body: { data: [body] },
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  }).catch((err) => {
    console.log({ err: JSON.stringify(err.data), errds: err.status });
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

export function generateContactInZohoBigin({
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
  console.log({ body });
  return $fetch("https://www.zohoapis.in/bigin/v2/Contacts", {
    method: "POST",
    body: { data: [body] },
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  }).catch((err) => {
    console.log("err", JSON.stringify(err.data));
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
    console.log("err", JSON.stringify(err.data));
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

export function generateLeadInZohoCRM({
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
  console.log({ body: JSON.stringify(body) });
  return $fetch("https://www.zohoapis.in/crm/v6/Leads", {
    method: "POST",
    body: { data: [body] },
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  }).catch((err) => {
    console.log({ err: JSON.stringify(err.data), errds: err.status });
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
