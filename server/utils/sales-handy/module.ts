const salesHandyBaseUrl = "https://leo-open-api-gateway.saleshandy.com/v1";

export const getSalesHandyClients = async (apiKey: string) => {
  try {
    const data:any = await $fetch(`${salesHandyBaseUrl}/prospects?pageSize=1000&page=1&sort=ASC&sortBy=createdAt`, {
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

export const getSalesHandySequences = async (apiKey: string) => {
  try {
    const data:any = await $fetch(`${salesHandyBaseUrl}/sequences?pageSize=1000&page=1&sortBy=sequence.createdAt`, {
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

export const getSalesHandyFields = async (apiKey: string) => {
  try {
    const data:any = await $fetch(`${salesHandyBaseUrl}/fields?systemFields=true`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey
      }
    })

    const fields:any[] = data.payload || []

    if(fields.length){
      return fields.map((field:any) => ({id: field.id, name: field.name}));
    }

    return [];
  } catch (error:any) {
    return [];
  }
};

export const getSalesHandyProspectUsers = async (apiKey: string) => {
  try {
    const data:any = await $fetch(`${salesHandyBaseUrl}/fields?systemFields=true`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey
      }
    })

    // const fields:any[] = data.payload || []

    // if(fields.length){
    //   return fields.map((field:any) => ({id: field.id, name: field.name}));
    // }

    return [];
  } catch (error:any) {
    return [];
  }
};