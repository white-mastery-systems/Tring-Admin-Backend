// const clientId = "7856740970225.7841202988373";
// const clientSecret = "b2c6269af5da3c2f7fb3fb929de90af7";

const clientId = "7763394615058.7867610213248";
const clientSecret = "546e3e06304360fe178e2736ca6b068c";

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

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Generates a Slack access token given a code obtained from
 * Slack's authorization flow.
 * @param {Object} opts
 * @param {string} opts.code - Authorization code obtained from
 *   Slack's authorization flow.
 * @return {Promise<Object>} A promise that resolves to an object
 *   containing the access token, refresh token, and other
 *   information about the token.
 */
/******  523ef877-df58-4dd5-a1a2-dd1283714e9b  *******/
export async function generateAccessTokenFromCodeForSlack({
  code,
}: {
  code: string;
}) {
  const response = await $fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response;
}
