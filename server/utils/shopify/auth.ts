const authConfig = {
  clientId: "e766d107bd1a2d83dfd696f9f16282b1",
  clientSecret: "666bc2fc9ff14bb72e5988d8814db09d",
};

//https://johnbstore.myshopify.com/admin/oauth/authorize?client_id=e766d107bd1a2d83dfd696f9f16282b1&scope=write_products,read_shipping,read_inventory&redirect_uri=https://6t53p9kf-3000.inc1.devtunnels.ms/settings/integration/shopify

export async function regenerateAccessTokenForShopify({
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

export async function generateAccessTokenFromCodeForShopify({
  code,
  shop,
}: {
  code: string;
  shop: string;
}) {
  try {
    const response = await $fetch(
      `https://${shop}/admin/oauth/access_token?client_id=${authConfig.clientId}&client_secret=${authConfig.clientSecret}&code=${code}`,
      {
        method: "POST",
      },
    );

    return response;
  } catch (err) {
    console.log(err.data, err.status, "ERROR");
  }
}
