const salesHandyBaseUrl = "https://leo-open-api-gateway.saleshandy.com/v1";

export const getSalesHandyClients = async (apiKey: string) => {
  try {
    const data:any = await $fetch(`${salesHandyBaseUrl}/clients?pageSize=25&page=1&sort=DESC&sortBy=createdDate`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey
      }
    })

    return { status: true, data: data.payload || [] };
  } catch (error:any) {
    return { status:false, message: "Invliad API key", error: error.message, data:[] };
  }
};