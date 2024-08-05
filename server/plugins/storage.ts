import redisDriver from "unstorage/drivers/redis";

export default defineNitroPlugin(() => {
  const storage = useStorage();

  // Dynamically pass in credentials from runtime configuration, or other sources
  const driver = redisDriver({
    url: useRuntimeConfig().redisUrl,
    ttl: 60 * 5, // 5 minutes
    /* other redis connector options */
  });
  // Mount driver
  storage.mount("redis", driver);
  // console.log(storage.getMounts());
});
