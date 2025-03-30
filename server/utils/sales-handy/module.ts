import countriesData from "~/assets/country-codes.json";
const salesHandyBaseUrl = "https://leo-open-api-gateway.saleshandy.com/v1";
// const salesHandyBaseUrl = "https://open-api.saleshandy.com/v1";

export const getSalesHandyClients = async (apiKey: string) => {
  try {
    const data:any = await $fetch(`${salesHandyBaseUrl}/clients?pageSize=1000&page=1&sort=ASC&sortBy=createdAt`, {
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

export const getSalesHandyAnalytics = async (apiKey: string, sequenceId: string) => {
  try {
    const data: any = await $fetch(`${salesHandyBaseUrl}/analytics/stats`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ sequenceId }),
    });

    return { status: true, data: data.payload || {} };
  } catch (error:any) {
    return { status:false, message: "Invliad API key", error: error.message, data:{} };
  }
}

export const getSalesHandyMultipleAnalytics = async (apiKey: string, sequenceIds: any[]) => {
  try {
    const year = new Date().getFullYear();
    const data: any = await $fetch(`${salesHandyBaseUrl}/analytics/consolidated-stats`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ 
        sequenceIds,
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
        pageNum: 1,
        pageLimit: 500
      }),
    });

    return { status: true, data: data.payload || {} };
  } catch (error:any) {
    return { status:false, message: "Invliad API key", error: error.message, data:{} };
  }
}

export const getUnRepliedSalesHandyUsersPhones = async (apiKey: string, sequenceId: string, sequenceName: string) => {
  try {
    const [sequenceList, analytics, prospectUsers, countryData] = await Promise.all([
      getSalesHandySequences(apiKey),
      getSalesHandyMultipleAnalytics(apiKey, [sequenceId]),
      getSalesHandyProspectUsers(apiKey),
      ipBasedDialCode(),
    ]);

    const stepsCount = sequenceList.data?.find((seq: any) => seq.title === sequenceName)?.steps?.length || 0;

    if (!analytics.data?.data?.length || !prospectUsers.length) return [];

    // Group by "Recipient Email" and count "Replied: No"
    const users = analytics.data.data.reduce((acc: any, { "Recipient Email": email, Replied }: any) => {
      if (Replied === "No") {
        acc[email] = acc[email] || { email, replied: "No", count: 0 };
        acc[email].count += 1;
      }
      return acc;
    }, {});

    // Create a lookup map for prospect users
    const prospectMap:Map<any, any> = new Map(
      prospectUsers.map(({ email, attributes }: any) => [
        email,
        Object.fromEntries(attributes.map(({ key, value }: any) => [key, value])),
      ])
    );

    // Extract matched user details
    return Object.values(users)
      .filter(({ email }: any) => prospectMap.has(email))
      .map(({ email, count }: any) => {
        const prospectData = prospectMap.get(email);
        const country = prospectData?.["Country"]?.toLowerCase() || countryData.country?.toLowerCase() || "india";
        const countryCode = countryData.dial_code || "+91"; // Default to +91 if not found
        const dialCode = countriesData.find(({ name }: any) => name?.toLowerCase() === country)?.dial_code || countryCode;

        return { stepsCount, count, email, phone: prospectData["Phone Number"], countryCode: dialCode };
      });
  } catch (error: any) {
    return []
  }
};

export const getSalesHandyProspectUsers = async (apiKey: string) => {
  try {
    const data:any = await $fetch(`${salesHandyBaseUrl}/prospects?pageSize=1000&page=1&sort=ASC&sortBy=createdAt`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey
      }
    })

    return data.payload || [];
  } catch (error:any) {
    return [];
  }
};

export const verifySalesHandyProspectsUserEmails = async (apiKey: string, emails:any[]) => {
  try {
    const data:any = await $fetch(`${salesHandyBaseUrl}/fields?systemFields=true`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify({ emails })
    })

    return data.payload || [];
  } catch (error:any) {
    return [];
  }
};

export const ipBasedDialCode = async () => {
  const data:any = await $fetch("https://ipwho.is/",{method: "GET", headers: {accept: "application/json"}})
  
  return {country: data.country, dial_code:`+${data?.calling_code}`.replace("++", "+") || "+91"};
}