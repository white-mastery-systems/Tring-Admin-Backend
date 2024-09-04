export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log({ body });
  // const http = require("https");
  interface zohoConfigInterface {
    client_id: string;
    client_secret: string;
    refresh_token: string;
    access_token: string;
    organization_id: string;
    code: string;
  }
  const zohoConfig: zohoConfigInterface = {
    client_id: "1000.IO80PNY7SQHW30W8MYY6LNBQ1DDXOG",
    client_secret: "0a4e4038a27157eb725527ba14f44952443d5aee4b",
    organization_id: "60031670124",
    code: "1000.27b82da2be8a1703b0ebc2d1e719dd17.b20bc7c290d964befeec526f2cc8f87f",
    refresh_token:
      "1000.503a26dbdb9d341009471790910379ac.f3df7ab33a8abda7852324457a57f6a4",
    access_token:
      "1000.9ad25fd0981458fbebeb41b1ca451a73.c2ed0f26ffb16ef889e4899a8ce6ea53",
  };
  const access_token = async () => {
    try {
      //       const generatedAuthResponse: any = await $fetch(
      //         `https://accounts.zoho.in/oauth/v2/token?client_id=${zohoConfig.client_id}&client_secret=${zohoConfig.client_secret}&grant_type=authorization_code&code=${zohoConfig.code}`,
      //         { method: "POST" },
      //       );
      //       console.log({ generatedAuthResponse });
      // return generatedAuthResponse;
      return await $fetch(
        `https://accounts.zoho.in/oauth/v2/token?client_id=${zohoConfig.client_id}&grant_type=refresh_token&client_secret=${zohoConfig.client_secret}&refresh_token=${zohoConfig.refresh_token}`,
      );
    } catch (err: any) {
      console.log({ err: err.message });
    }
  };
  console.log({ access_token: await access_token() });

  const options = {
    method: "POST",
    hostname: "www.zohoapis.com",
    port: null,
    path: "/billing/v1/hostedpages/newsubscription",
    headers: {
      "X-com-zoho-subscriptions-organizationid": zohoConfig.organization_id,
      Authorization: `Zoho-oauthtoken ${zohoConfig.access_token}`,
      "content-type": "application/json",
    },
  };

  // const req = http.request(options, function (res) {
  //   const chunks = [];

  //   res.on("data", function (chunk) {
  //     chunks.push(chunk);
  //   });

  //   res.on("end", function () {
  //     const body = Buffer.concat(chunks);
  //     console.log(body.toString());
  //   });
  // });

  // req.write(JSON.stringify({ field1: "value1", field2: "value2" }));
  // req.end();
  return { success: "true" };
});
