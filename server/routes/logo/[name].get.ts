import fs from "fs";
import { join } from "path";

export default defineEventHandler(async (event) => {
  const base = "data";
  const param = getRouterParam(event, "name");

  return sendStream(event, fs.createReadStream(join("./assets/logo", param!)));
});
