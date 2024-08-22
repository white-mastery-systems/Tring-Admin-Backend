export function getAllPipelinesFromZohoBigin({ token }: { token: string }) {
  try {
    const data = $fetch(
      "https://www.zohoapis.in/bigin/v2/Pipelines?fields=Sub_Pipeline,Pipeline,Stage",
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );
    return data;
  } catch (err) {
    console.log("MESS", err.data);
  }
}

export function generateLeadInZohoBigin({
  token,
  body,
}: {
  token: string;
  body: any;
}) {
  console.log({ token, body });
  try {
    const data = $fetch("https://www.zohoapis.in/bigin/v2/Pipelines", {
      method: "POST",
      body: { data: [body] },
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    }).catch((err) => {
      console.log({ err: err.message, es: err.status, err: err.data });
    });
    return data;
  } catch (err) {
    console.log("MESS", err.status, err.message);
  }
}
