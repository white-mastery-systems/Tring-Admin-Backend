import { errorResponse } from "~/server/response/error.response";
import { getSalesHandyClients } from "~/server/utils/sales-handy/module";

export default defineEventHandler(async (event) => {
  try {

    const { apiKey }= await getQuery(event);

    if (!apiKey) {
      return errorResponse(event, 401, "API key is required");
    }

    const salesHandyClients = await getSalesHandyClients(`${apiKey}`);

    if(!salesHandyClients.status) {
      // return errorResponse(event, 400, salesHandyClients.message);
      return salesHandyClients;
    }

    return salesHandyClients;
  } catch (error:any) {
    return errorResponse(event, 500, `Unable to get Sales handy clients ${error.message}`);
  }
});
