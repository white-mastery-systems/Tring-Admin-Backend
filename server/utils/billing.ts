import { readFileSync } from "fs";
import { join } from "path";
import { getHostedPageDetails } from "./zoho/modules";

const credentialsPath = join(process.cwd(), "zoho_config.json");
const credentials = JSON.parse(readFileSync(credentialsPath, "utf-8"));

// Function to get the access token
const db = useDrizzle();
export async function fetchFromZohoApi(accessToken: string, hostedPageId: string) {
 
}
