import schedule from "node-schedule";
import { logger } from "~/server/logger";

const generateTemplateComponents = (body: any[], header?: any) => {
  const components: any[] = [
    {
      type: "header",
      parameters: [
        {
          type: "image",
          image: {
            link:
              header ?? "https://www.sis.in/florence/assets/img/popup1-new.jpg",
          },
        },
      ],
    },
  ];
  if (body.length) {
    components.push({
      type: "body",
      parameters: body.map((item) => ({ type: "text", text: item })),
    });
  }
  return components;
};

const sendWhatsappTemplateMessage = async (
  metaToken: string,
  phoneId: string,
  userPhone: string,
  templateName: string,
  components: Record<string, any>,
  language?: string,
) => {
  try {
    const body = components;
    components = generateTemplateComponents([
      body.name,
      body.organization,
      body.project,
      body.number,
      body.manager,
      body.organizationName,
    ]);
    console.log({ components });
    const data = await $fetch(
      `https://graph.facebook.com/v20.0/${phoneId}/messages`,
      {
        ignoreResponseError: true,
        method: "post",
        headers: {
          Authorization: `Bearer ${metaToken}`,
        },
        body: {
          messaging_product: "whatsapp",
          to: userPhone,
          type: "template",
          template: {
            name: templateName,
            language: {
              code: language ?? "en_US",
            },
            // components,
          },
        },
      },
    );
    // console.log({ data: JSON.stringify(data) });
    return data;
  } catch (err) {
    console.log(err, "ERRRR");
  }
};

export const scheduleEvent = async (
  date: any,
  time: any,
  contactList: any,
  campaignInformation: any,
  whatsappInformation: any,
) => {
  try {
    //    const url = "https://graph.facebook.com/v20.0/361306107076548/register";
    // const response = await fetch(url, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     "messaging_product": "whatsapp",
    //     "pin": "000000",
    //     "tier": "prod",
    //     "access_token": "EAAwYX9ZCRR1gBO89XVgTPjAzYShyfOaYVa5hOgkzqfG1Ftm0WzXVoikW2Ikhy56h6IqwyZCvYj5pnIL2NJa90c25nQqeoEnfBl4ZAUZAuDBKoRvVNsbar9lZBX6Pi3ZC7qaczSgnvEInv75Fi6iHqWYA1BDNxkfLjzdyMEejpfZCpQaA6j6ZCyYgP0QeCnDfIrZBGLvnHjCbu1mX1dEiZCqaApBpeh6tzKsG9SEGfdKjxUOZAYVsEmflnlLDtOC2KU6"
    //   }),
    //   headers: {"Content-Type": "application/json"},
    // });
    // const data = await response.json();
    // console.log(data);
    console.log({ contactList });
    console.log({ campaignInformation });
    const phoneId = campaignInformation?.metadata?.phoneId;
    // const phoneId = "112867458396790";
    // const phoneId = "401871499682721";
    // const phoneId = "361306107076548";
    // const phoneId = "112867458396790";
    const metaToken = whatsappInformation?.metadata?.access_token;
    // const metaToken =
    //   "EAAwYX9ZCRR1gBOZC9Ihmxr49ZByWwotyJTCy88DjvVojsVPmbUB5NzkYbQ3eFDhss7lGeN6D4CUkEuoGM5VDIgZB309gV0I36KZA0g7QLGtZBkeFRsozomPZBkCMeJ8SZBOWJbSWzlBkMTvjqmk6Xj5qFEqqduzZAjTqtLo44XaWmHnewprbBYkWmCVBs6xZCxZBZBEk6QhgvJZA4MuZCdiMmpTKOeeQ5WyP38rPBcS5dt";
    // const metaToken =
    //   "EAAwYX9ZCRR1gBO3qnIp3vYgK1UF6GDpA2UC0Xa3rPG3DUvZBAv7uHgMQAsT2jSyUsvk273dRfpRjNKepHKeZBrqjnYBTZAV6KHu8JxRRjpk0fIWKBKnGmZCdMHYqqRfGNH0nw2ZBM0Eda5vl6cWFMGme2mvZCtCUBcKegsbIr1tOJ9CJ5ATNlAQv42K0C3QSguo9gZBO4iM6EVz19HJmJZB0UZAZBzAZANVnQhZCOAZBEZD";
    // const metaToken =
    //   "EAAwYX9ZCRR1gBO7uLjZCbu8rgnvV1VOuz23Yl9W5sDoHEykuaZBfGWMfI7nfrHl5Sn1tkrZB9G3aP9FjQ1gZBxSrSNzNYZBAIduJZAyS7kuTFLH20yZBJFFnWHnCycOOcZCEdlZA79kaF2hALBxWz1TbxlTgxbe9M9IkQZAhKvjeP0eSXkPARMZCS9CL0QNhX12X6DeHigQZBwZAWPMZBsDtvJvjIrXxq4DbWx6OpBMgDEZD";
    // const metaToken =
    //   "EAAwYX9ZCRR1gBO2g5XEpsR7ZAhogIpibKW577rwe2GErcWZCQS7uPM3HPO9lsQaKVVlAV2DBBy2ltUU5ByuZCc0BwSKK4jZCZCg6xZCGA0NBKtJAvhd3rLBzf8fe3SoXxtYqaAGbdynj0cbfpOO3qz3Gpn5cF7dY5eDWPKVwkmFpQLe9ZA6ENZC6gkfy529hEAr8THdBfToWDU6uRhu1MMXxo7RUClwByaxRj748LkAVD3UzmUxxULM0pZCkTuEO4gct8y5norOPSs1gZDZD";
    // const metaToken= "EAAwYX9ZCRR1gBO2ioA7fTdz5SUSdLZAcDdHyQZCIi7dAiKkI2OVqYEgpbbY1JUTPF6FsbbvYbV4hFwZBMtehzff98JFdf2V5YFZBALLSEo0BHFYk54tii9cefhX28ZBi3XjIOaDMrpsrDW3xQcQbRv5BYCP5nZBRGXJoUSAcgPd79X0jSPtArfvSdVspKBbesISKQZDZD"
    // const phoneId= "112867458396790"
    // const userPhone= "919841513901"
    const templateName = campaignInformation?.metadata?.templateId;
    // const templateName = "client_follow_up_sis";
    const organization = "South India Shelters";
    const salesmanager = "Reena";
    const language = "en_US";

    const assigned_date = new Date(date);
    const assigned_Time = new Date(time);
    // const assigned_date = new Date();
    // const assigned_Time = new Date();

    const year = assigned_date.getFullYear();
    const month = assigned_date.getUTCMonth();
    const day = assigned_date.getUTCDate();
    const hours = assigned_Time.getUTCHours();
    const minutes = assigned_Time.getUTCMinutes();

    console.log({
      year,
      month,
      date: day,
      hour: hours,
      minute: minutes,
      tz: "UTC",
    });

    contactList.forEach(async (item: any) => {
      console.log({ item: item.phone });
      const phoneNumber = `${item.countryCode}${item.phone}`.replace("+", "");
      console.log({ phoneNumber });
      const components = {
        name: item.firstName,
        organization,
        project: "Testing",
        number: phoneNumber,
        manager: salesmanager,
        organizationName: organization,
      };
      const data = await sendWhatsappTemplateMessage(
        metaToken,
        phoneId,
        phoneNumber,
        templateName,
        components,
        language,
      );
      console.log({ data });
    });

    const event = schedule.scheduleJob(
      { year, month, date: day, hour: hours, minute: minutes, tz: "UTC" },
      () => {
        logger.info({ level: "info", message: "Message sending..." });
        contactList.forEach(async (item: any) => {
          console.log({ item: item.phone });
          const phoneNumber = `${item.countryCode}${item.phone}`.replace(
            "+",
            "",
          );
          console.log({ phoneNumber });
          const components = {
            name: item.firstName,
            organization,
            project: "Testing",
            number: phoneNumber,
            manager: salesmanager,
            organizationName: organization,
          };
          const data = await sendWhatsappTemplateMessage(
            metaToken,
            phoneId,
            phoneNumber,
            templateName,
            components,
            language,
          );
          console.log({ data });
        });
      },
    );
    console.log({ event });
    if (!event) {
      return { status: false };
    }
    return { status: true };
  } catch (error: any) {
    logger.error({ level: "error", message: error.message });
    return { status: false };
  }
};
