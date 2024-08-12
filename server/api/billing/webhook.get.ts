import { readFileSync } from "fs";
import { join } from "path";

const db = useDrizzle();

// Load credentials from JSON file
const credentialsPath = join(process.cwd(), "zoho_config.json");

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const webHookId = query.hostedpage_id as string;

  try {
    const credentials = JSON.parse(readFileSync(credentialsPath, "utf-8"));
    const currentAccessToken = credentials.access_token;

    // Fetch data from Zoho API
    const response = await fetchFromZohoApi(currentAccessToken, webHookId);

    const apiResponseData = {
      org_id: response.data.subscription.customer.cf_org_id,
      customer_id: response.data.subscription.customer.customer_id,
      plan_code: response.data.subscription.plan.plan_code,
      subscription_metadata: response.data.subscription,
      customer_metadata: response.data.subscription.customer,
    };

    try {
      await db.insert(billingSchema).values(apiResponseData).returning();
    } catch (error) {
      console.error(`Failed to insert data into DB: ${error}`);
    }

    return sendRedirect(event, "/");
  } catch (error) {
    return {
      error: "Failed to fetch data from Zoho API",
      details: error,
    };
  }
});
