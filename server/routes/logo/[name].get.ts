import { stat, readFile } from "node:fs/promises";
import fs from "fs";
import { join } from "path";
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const base = "data";
  const param = getRouterParam(event, "name");
  console.log({ data: "Get Logo", param, base: config.logoDir });
  return sendStream(event, fs.createReadStream(join(config.logoDir, param!)));
});
