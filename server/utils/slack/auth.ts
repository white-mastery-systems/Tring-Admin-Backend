export async function regenerateAccessTokenForSlack({
  refreshToken,
  integrationData,
}: {
  refreshToken: string;
  integrationData: any;
}) {
  const response = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",

    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

export async function generateAccessTokenFromCodeForSlack({
  code,
}: {
  code: string;
}) {
  const response = await $fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    body: new URLSearchParams({
      code,
      client_id: "7856740970225.7841202988373",
      client_secret: "b2c6269af5da3c2f7fb3fb929de90af7",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  console.log({ response });
  return response;
}
