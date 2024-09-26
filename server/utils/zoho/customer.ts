export const updateZohoCustomer = async (customerId: string, metaData: any, customerDetails: any) => {
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
    console.log({ metaData })
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
    console.log({ data })
    return { status: true, data }
  } catch(error) {
    const integrationData = metaData
    if (error instanceof Error) {
      const response = (error as any).response;
      console.log({ response })
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
        console.log({ error })
        return { status: false }
      }
    }
  }
}