import countriesData from "~/assets/country-codes.json";
import { logger } from "~/server/logger";
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
    logger.error(`Fetch SalesHandy Clients Error: ${error.message}`);
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
    logger.error(`Fetch SalesHandy Sequences Error: ${error.message}`)
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
    logger.error(`Fetch SalesHandy Fields Error: ${error.message}`);
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
    return { status: true, data: data?.payload || {} };
  } catch (error:any) {
    logger.error(`Fetch SalesHandy Analytics Error: ${error.message}`);
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
    logger.error(`Fetch SalesHandy Consoildated Analytics Error: ${error.message}`);
    return { status:false, message: "Invliad API key", error: error.message, data:{} };
  }
}

export const getUnRepliedSalesHandyUsersPhones = async (apiKey: string, sequenceId: string, sequenceName: string) => {
  try {
    const [matchedSequence, analytics, prospectUsers, countryData] = await Promise.all([
      verifySequenceStatus(apiKey, sequenceId, sequenceName),
      getSalesHandyMultipleAnalytics(apiKey, [sequenceId]),
      getSalesHandyProspectUsers(apiKey),
      ipBasedDialCode(),
    ]);

    if (!analytics.data?.data?.length || !prospectUsers.length) return [];

    if (!matchedSequence) {
      return [];
    }
    
    const stepsCount = matchedSequence?.stepsCount

    // Group by "Recipient Email" and count "Replied: No"
    const users = analytics.data?.data?.reduce((acc: any, { "Recipient Email": email, Replied }: any) => {
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
    logger.error(`Fetch SalesHandy Un Replied User Phones Error: ${error.message}`);
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
    logger.error(`Fetch SalesHandy Prospect Users Error: ${error.message}`);
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
    logger.error(`Verify SalesHandy Prospect User Emails  Error: ${error.message}`);
    return [];
  }
};

export const ipBasedDialCode = async () => {
  const data:any = await $fetch("https://ipwho.is/",{method: "GET", headers: {accept: "application/json"}})
  
  return {country: data.country, dial_code:`+${data?.calling_code}`.replace("++", "+") || "+91"};
}

export const verifySequenceStatus = async (apiKey: string, sequenceId:string, sequenceName:string) => {
  try {
    const [sequenceList, analyticsData] = await Promise.all([
      getSalesHandySequences(apiKey),
      getSalesHandyAnalytics(apiKey, sequenceId),
    ]);

    const sequence = sequenceList.data?.find((item:any)=> item.id === sequenceId || item.title === sequenceName)
    if(sequence && analyticsData.data?.prospects[0]?.total && analyticsData.data?.emails?.total){
      const stepsCount = sequence.steps?.length || 0;
      const emailCount = analyticsData.data?.emails?.total || 0;
      const userCount = analyticsData.data?.prospects[0]?.total || 0;
      const totalMailCount = stepsCount * userCount;
      logger.info(`${JSON.stringify({ stepsCount, emailCount, userCount, totalMailCount})}`)
      return (totalMailCount === emailCount)? { ...sequence, stepsCount, emailCount, userCount, totalMailCount }: null;
    }
    return null
  } catch (error:any) {
    logger.error(`Verify SalesHandy Sequence completed status Error: ${error.message}`);
    return null
  }
}

export const getAllCompletedSequences = async (apiKey: string) =>{
  try {
    const sequenceList = await getSalesHandySequences(apiKey)
  
    if(Array.isArray(sequenceList.data) && sequenceList.data.length){
      const data = await Promise.all(sequenceList.data.map(async(item:any)=>{
        if(item.steps?.length){
          const analyticsData = await getSalesHandyAnalytics(apiKey, item.id)
          const emailCount = analyticsData.data?.emails?.total || 0;
          const userCount = analyticsData.data?.prospects[0]?.total || 0;
          const totalMailCount = item.steps?.length * userCount;
  
          logger.info(`${JSON.stringify({ stepsCount: item.steps?.length, emailCount, userCount, totalMailCount})}`)
          return (totalMailCount === emailCount)? { ...item, emailCount, userCount, totalMailCount }: null;
        }
        return null
      }))
      return data.filter(Boolean)
    }
    return []
  } catch (error:any) {
    logger.error(`Fetch SalesHandy Completed Sequences Error: ${error.message}`);
    return []
  }
}

export const getMailCountValidation = (stepsCount:number, notRepliedCount:number) =>{
  return (
    (stepsCount === 1 && notRepliedCount === 1) || // Case 1: stepsCount = 2 and notRepliedCount = 2
    (stepsCount <= 3 && notRepliedCount >= 2) || // Case 2: stepsCount = 3 and notRepliedCount >= 2
    (stepsCount > 3 && notRepliedCount >= 3) // Case 3: stepsCount > 3 and notRepliedCount >= 3
  )}