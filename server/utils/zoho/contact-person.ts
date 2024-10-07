import { logger } from "~/server/logger";
import { regerateAccessTokenForTringAdmin } from "./modules";

// create contact-person in zoho
export const createContactPerson: any = async(organizationId: string, user: any, metaData: any, customerId: string) => {
  try {
    logger.info(`entering createContactPerson func----${JSON.stringify(metaData)}`)
    let firstName = user?.name;
    let lastName = "";
    if (firstName?.includes(" ")) {
      firstName = firstName?.split(" ")[0];
      lastName = firstName?.split(" ")[1];
    }
  
    // console.log({ customerId })
    const data = await $fetch(
      `https://www.zohoapis.in/billing/v1/customers/${customerId}/contactpersons`,
      {
        method: "POST",
        headers: {
          "X-com-zoho-subscriptions-organizationid": metaData.organization_id,
          Authorization: `Zoho-oauthtoken ${metaData.access_token}`,
          "content-type": "application/json",
        },
        body: {
          first_name: firstName,
          last_name: lastName,
          email: user?.email,
          mobile: user?.mobile,
        }
      }
    )
    logger.info(`Zoho create contact-person data:---${JSON.stringify(data)}`)
    return { status: true, data }
  } catch (error) {
    const integrationData = metaData
    if (error instanceof Error) {
      const response = (error as any).response;
      logger.error(`Error: Zoho create contact-person:----${JSON.stringify(response)}`)
      if (response && response.status === 401) {
          const newAuthInfo = await regerateAccessTokenForTringAdmin({ integrationData })
          logger.info(`newAUthInfo after regerate Access-Token----${JSON.stringify(newAuthInfo)}`)
          return await createContactPerson(
            organizationId,
            user,
            newAuthInfo,
            customerId
          );
      } else {
        logger.error(`Error: Zoho create contact-person:----${JSON.stringify(error)}`)
        return { status: false }
      }
    }
  }
}

export const updateContactPerson: any = async (organizationId: string, user: any, metaData: any, customerId: string, contactPersonId: string) => {
  try {
      let firstName = user?.username;
      let lastName = "";
      if (firstName?.includes(" ")) {
        firstName = firstName?.split(" ")[0];
        lastName = firstName?.split(" ")[1];
      }
      const data = await $fetch(`https://www.zohoapis.in/billing/v1/customers/${customerId}/contactpersons/${contactPersonId}`,
        {
          method: "PUT",
          headers: {
            "X-com-zoho-subscriptions-organizationid": metaData.organization_id,
            Authorization: `Zoho-oauthtoken ${metaData.access_token}`,
            "content-type": "application/json",
          },
          body: {
            first_name: firstName,
            last_name: lastName,
            email: user?.email,
            mobile: user?.mobile,
          }
        }
      )
      logger.info(`Zoho update contact-person data:---${JSON.stringify(data)}`)
      return { status: true, data }
  } catch (error) {
      const integrationData = metaData
      if (error instanceof Error) {
        const response = (error as any).response;
        logger.error(`Error: Zoho update contact-person:---${JSON.stringify(response)}`)
        if (response && response.status === 401) {
            const newAuthInfo = await regerateAccessTokenForTringAdmin({ integrationData })
            return await updateContactPerson(
              organizationId,
              user,
              newAuthInfo,
              customerId,
              contactPersonId
            );
        } else {
          logger.error(`Error: Zoho update contact-person:---${JSON.stringify(error)}`)
          return { status: false }
        }
      }
  }
}