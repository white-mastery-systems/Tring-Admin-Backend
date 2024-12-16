import { logger } from "~/server/logger";

export const createZohoCustomer: any = async (metaData: any, customerDetails: any) => {
  try {
    let firstName = customerDetails?.username;
    let lastName = "";
    if (firstName?.includes(" ")) {
      firstName = firstName?.split(" ")[0];
      lastName = firstName?.split(" ")[1];
    }
    const createCustomer = {
      display_name: `${firstName} ${lastName}`,
      first_name: firstName,
      last_name: lastName,
      email: customerDetails?.email,
      mobile: customerDetails?.mobile,
      currency_code: customerDetails?.address.country === "India" ? "INR" : "USD",
      billing_address: {
        attention: customerDetails?.username,
        street: customerDetails?.address?.street,
        city: customerDetails?.address?.city,
        state: customerDetails?.address?.state,
        zip: customerDetails?.address?.zipCode,
        country: customerDetails?.address?.country
      },
      shipping_address: {
        attention: customerDetails?.username,
        street: customerDetails?.address?.street,
        city: customerDetails?.address?.city,
        state: customerDetails?.address?.state,
        zip: customerDetails?.address?.zipCode,
        country: customerDetails?.address?.country
      }
    }

    const data = await await $fetch(
      `https://www.zohoapis.in/billing/v1/customers`,
      {
        method: "POST",
        headers: {
          "X-com-zoho-subscriptions-organizationid": metaData?.organization_id,
          Authorization: `Zoho-oauthtoken ${metaData?.access_token}`,
          "content-type": "application/json",
        },
        body: createCustomer
      }
    )
    logger.info(`Zoho create-customer: - ${JSON.stringify(data)}`)
    return { status: true, data }

  } catch (error: any) {
    logger.error(`createZohoCustomer: metadata: ${JSON.stringify(metaData)}, customerDetails: ${JSON.stringify(customerDetails)}, error: ${JSON.stringify(error.data)}}`)
     const integrationData = metaData
    if (error instanceof Error) {
      const response = (error as any).response;
      if (response && response.status === 401) {
          // console.log({ integrationData })
          const newAuthInfo = await regerateAccessTokenForTringAdmin({ integrationData })
          // console.log({ newAuthInfo })
          return await createZohoCustomer(
            newAuthInfo,
            customerDetails
          );
      } else {
        return { status: false }
      }
    }
  }
}


export const updateZohoCustomer: any = async (customerId: string, metaData: any, customerDetails: any) => {
  try {
    let firstName = customerDetails?.username;
    let lastName = "";
    if (firstName?.includes(" ")) {
      firstName = firstName?.split(" ")[0];
      lastName = firstName?.split(" ")[1];
    }
   
    const updatedCustomer = {
      display_name: `${firstName} ${lastName}`,
      first_name: firstName,
      last_name: lastName,
      email: customerDetails?.email,
      mobile: customerDetails?.mobile,
      billing_address: {
        attention: customerDetails?.username,
        street: customerDetails?.address?.street,
        city: customerDetails?.address?.city,
        state: customerDetails?.address?.state,
        zip: customerDetails?.address?.zipCode,
        country: customerDetails?.address?.country
      },
      shipping_address: {
        attention: customerDetails?.username,
        street: customerDetails?.address?.street,
        city: customerDetails?.address?.city,
        state: customerDetails?.address?.state,
        zip: customerDetails?.address?.zipCode,
        country: customerDetails?.address?.country
    }
    }
    // console.log({ metaData })
    const data = await await $fetch(
      `https://www.zohoapis.in/billing/v1/customers/${customerId}`,
      {
        method: "PUT",
        headers: {
          "X-com-zoho-subscriptions-organizationid": metaData?.organization_id,
          Authorization: `Zoho-oauthtoken ${metaData?.access_token}`,
          "content-type": "application/json",
        },
        body: updatedCustomer
      }
    )
    logger.info(`Zoho update-customer: - ${JSON.stringify(data)}`)
    return { status: true, data }
  } catch(error) {
    const integrationData = metaData
    if (error instanceof Error) {
      const response = (error as any).response;
      logger.error(`Error: Zoho update-customer:${JSON.stringify(response)}`)
      if (response && response.status === 401) {
          // console.log({ integrationData })
          const newAuthInfo = await regerateAccessTokenForTringAdmin({ integrationData })
          // console.log({ newAuthInfo })
          return await updateZohoCustomer(
            customerId,
            newAuthInfo,
            customerDetails
          );
      } else {
        logger.error(`Error: Zoho update-customer:${JSON.stringify(error)}`)
        return { status: false }
      }
    }
  }
}