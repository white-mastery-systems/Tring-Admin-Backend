import { adminConfigurationSchema } from "~/server/schema/admin";
interface zohoConfigInterface {
  metaData: {
    client_id: string;
    client_secret: string;
    refresh_token: string;
    access_token: string;
    organization_id: string;
    code: string;
  };
}
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // const http = require("https");
  interface zohoConfigInterface {
    client_id: string;
    client_secret: string;
    refresh_token: string;
    access_token: string;
    organization_id: string;
    code: string;
  }
  const db = useDrizzle();
  try {
    const zohoData: any = await db.query.adminConfigurationSchema.findFirst({
      where: eq(adminConfigurationSchema.id, 1),
    });
    //  try{
    //    const newData = await $fetch(
    //     "https://accounts.zoho.in/oauth/v2/token?client_id=1000.IO80PNY7SQHW30W8MYY6LNBQ1DDXOG&client_secret=0a4e4038a27157eb725527ba14f44952443d5aee4b&grant_type=authorization_code&code=1000.19fbf52b8fe24a2f597031f9b2639f17.5df1c6d728a4296c2b8c0dd64252e133",
    //   );
    //  }catch(err){
    //   console.log({err})
    //  }
    // console.log({ newData });
    const regerateAccessToken = async () => {
      try {
        console.log(
          `https://accounts.zoho.in/oauth/v2/token?client_id=${zohoData?.metaData?.client_id}&grant_type=refresh_token&client_secret=${zohoData?.metaData?.client_secret}&refresh_token=${zohoData?.metaData?.refresh_token}`,
        );
        const newAuthInfo: any = await $fetch(
          `https://accounts.zoho.in/oauth/v2/token?client_id=${zohoData?.metaData?.client_id}&grant_type=refresh_token&client_secret=${zohoData?.metaData?.client_secret}&refresh_token=${zohoData?.metaData?.refresh_token}`,
          {
            method: "POST",
          },
        );

        console.log({ newAuthInfo });
        await db
          .update(adminConfigurationSchema)
          .set({ metaData: { ...zohoData.metaData, ...newAuthInfo } })
          .where(eq(adminConfigurationSchema.id, 1));
        return newAuthInfo;
      } catch (err: any) {
        console.log(err.status, "ERRO ON AUTH");
      }
    };
    // const req = http.request(options, function (res) {
    //   const chunks = [];

    //   res.on("data", function (chunk) {
    //     chunks.push(chunk);
    //   });

    //   res.on("end", function () {
    //     const body = Buffer.concat(chunks);
    //
    //   });
    // });

    // req.write(JSON.stringify({ field1: "value1", field2: "value2" }));
    // req.end();
    console.log(zohoData?.metaData, "metadata");
    try {
      await $fetch(
        "https://www.zohoapis.in/billing/v1/hostedpages/newsubscription",
        {
          method: "POST",
          headers: {
            "X-com-zoho-subscriptions-organizationid":
              zohoData?.metaData.organization_id,
            Authorization: `Zoho-oauthtoken ${zohoData?.metaData.access_token}`,
            "content-type": "application/json",
          },
          body: {
            add_to_unbilled_charges: true,
            customer: {
              display_name: "Bowman Furniture",
              salutation: "Mr.",
              first_name: "Benjamin",
              last_name: "George",
              email: "benjamin.george@bowmanfurniture.com",
              company_name: "Bowman Furniture",
              billing_address: {
                attention: "Benjamin George",
                street: "Harrington Bay Street",
                city: "Salt Lake City",
                state: "CA",
                country: "U.S.A",
                zip: 92612,
                fax: 4527389,
              },
              shipping_address: {
                attention: "Benjamin George",
                street: "Harrington Bay Street",
                city: "Salt Lake City",
                state: "CA",
                zip: 92612,
                country: "U.S.A",
                fax: 4527389,
              },
              payment_terms: 0,
              payment_terms_label: "Due On Receipt",
              custom_fields: [
                {
                  label: "string",
                  value: "string",
                },
              ],
              place_of_contact: "TN",
              gst_no: "33AAAAA0000A1Z5",
              gst_treatment: "business_gst",
              vat_treatment: "overseas",
              vat_reg_no: 51423456782,
              country_code: "DE",
              is_taxable: true,
              tax_id: "903000002345",
              tax_authority_id: "903000006345",
              tax_authority_name: "ATO",
              tax_exemption_id: "903000006345",
              tax_exemption_code: "GST FREE",
            },
            customer_id: null,
            plan: {
              plan_code: "basic-monthly",
              name: "GatorHost-Basic",
              quantity: 1,
              price: 50,
            },
            payment_gateways: [
              {
                payment_gateway: "stripe",
              },
            ],
            // payment_terms: 0,
            // payment_terms_label: "Due On Receipt",
            // custom_fields: [
            //   {
            //     label: "string",
            //     value: "string",
            //   },
            // ],
            // // contactpersons: [
            // //   {
            // //     contactperson_id: "903000000000099",
            // //   },
            // // ],
            // card_id: "9030000079226",
            // starts_at: "2016-06-05",
            // exchange_rate: 2,
            // place_of_supply: "TN",
            // plan: {
            //   plan_code: "basic-monthly",
            //   plan_description: "Monthly Basic plan",
            //   price: 50,
            //   setup_fee: 20,
            //   setup_fee_tax_id: "9030000123123",
            //   tags: [
            //     {
            //       tag_id: 0,
            //       tag_option_id: 0,
            //     },
            //   ],
            //   item_custom_fields: [
            //     {
            //       label: "string",
            //       value: "string",
            //     },
            //   ],
            //   quantity: 1,
            //   tax_id: null,
            //   tax_exemption_id: "903000006345",
            //   tax_exemption_code: "GST FREE",
            //   // tds_tax_id: 982000000557012,
            //   // sat_item_key_code: 71121206,
            //   unitkey_code: "E48",
            //   setup_fee_tax_exemption_id: "9030000123098",
            //   setup_fee_tax_exemption_code: "GST FREE",
            //   exclude_trial: false,
            //   exclude_setup_fee: false,
            //   billing_cycles: -1,
            //   trial_days: 0,
            // },
            // addons: [
            //   {
            //     addon_code: "Email-basic",
            //     addon_description: "Monthly addon.",
            //     price: 50,
            //     quantity: null,
            //     tags: [
            //       {
            //         tag_id: 0,
            //         tag_option_id: 0,
            //       },
            //     ],
            //     item_custom_fields: [
            //       {
            //         label: "string",
            //         value: "string",
            //       },
            //     ],
            //     tax_id: null,
            //     tax_exemption_id: "903000006345",
            //     tax_exemption_code: "GST FREE",
            //     tds_tax_id: 982000000557012,
            //     sat_item_key_code: 71121206,
            //     unitkey_code: "E48",
            //   },
            // ],
            // coupon_code: "Flat10",
            // // auto_collect: true,
            // reference_id: "bowmanfurniture",
            // salesperson_name: "Franklin",

            // create_backdated_invoice: true,
            // can_charge_setup_fee_immediately: false,
            // template_id: 903000000063009,
            // cfdi_usage: "acquisition_of_merchandise",
            // allow_partial_payments: true,
            // account_id: "90300000792007",
          },
        },
      );
    } catch (err: any) {
      console.log("ERRRO HAPPEND", err.status, err.data);

      if (err.status === 401) {
        const response = regerateAccessToken();
      }
    }
  } catch (err) {
    if (err instanceof Error) console.log(err.message, "message");
  }

  return { success: "true" };
});
