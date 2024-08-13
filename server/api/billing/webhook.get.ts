import { readFileSync } from "fs";
import { join } from "path";
import planDetails from "~/assets/config/plans.json";

const db = useDrizzle();

// Load credentials from JSON file
const credentialsPath = join(process.cwd(), "zoho_config.json");

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const webHookId = query.hostedpage_id as string;

  const orgId = await isOrganizationAdminHandler(event);

  try {
    const credentials = JSON.parse(readFileSync(credentialsPath, "utf-8"));
    const currentAccessToken = credentials.access_token;

    // Fetch data from Zoho API
    const response = await fetchFromZohoApi(currentAccessToken, webHookId);

    console.log(
      "Response from Zoho API:",
      response.data.subscription.customer.cf_user_id,
      orgId,
      response.data.subscription.plan.plan_code,
    );

    // Insert data into DB
    const apiResponseData = {
      user_id:
        "41c202ba-a1ce-492c-814f-e998e1f7dddc" ||
        response.data.subscription.customer.cf_user_id,
      org_id: orgId!,
      customer_id: response.data.subscription.customer.customer_id,
      plan_code: response.data.subscription.plan.plan_code,
      subscription_metadata: response.data.subscription,
      customer_metadata: response.data.subscription.customer,
    };

    try {
      const billingPromise = db
        .insert(billingSchema)
        .values(apiResponseData)
        .returning();
      const organizationPromise = db
        .update(organizationSchema)
        .set({
          maxQuota: planDetails[apiResponseData.plan_code].availableQuota,
          usedQuota: 0,
        })
        .where(eq(organizationSchema.id, orgId!));

      await Promise.allSettled([billingPromise, organizationPromise]);
      return { status: "Payment Successful" };
    } catch (error) {
      console.error(`Failed to insert data into DB: ${error}`);
    }
  } catch (error) {
    return {
      error: "Failed to fetch data from Zoho API",
      details: error,
    };
  }
});
