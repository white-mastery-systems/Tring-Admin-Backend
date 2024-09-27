import { regerateAccessTokenForTringAdmin } from "./modules";

// create contact-person in zoho
export const createContactPerson: any = async(organizationId: string, user: any, metaData: any, customerId: string, contactPersonId: string) => {
  try {
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
    return { status: true, data }
  } catch (error) {
    const integrationData = metaData
    if (error instanceof Error) {
      const response = (error as any).response;
      if (response && response.status === 401) {
          const newAuthInfo = await regerateAccessTokenForTringAdmin({ integrationData })
          // console.log("after----",{ newAuthInfo })
          return await createContactPerson(
            organizationId,
            user,
            newAuthInfo,
            customerId
          );
      } else {
        console.log({ error })
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
      return { status: true, data }
  } catch (error) {
      const integrationData = metaData
      if (error instanceof Error) {
        const response = (error as any).response;
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
          console.log({ error })
          return { status: false }
        }
      }
  }
}