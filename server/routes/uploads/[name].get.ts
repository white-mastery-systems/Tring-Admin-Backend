import fs from "fs";
import { join } from "path";
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const base = "data";
  const param = getRouterParam(event, "name");

  return sendStream(event, fs.createReadStream(join("./assets/uploads", param!)));
});
