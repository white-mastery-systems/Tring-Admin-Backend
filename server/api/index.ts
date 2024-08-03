export default defineEventHandler(async (event) => {
  const s = useStorage("redis");
  return await s.getItem("rag/prompts/placeholder");
  // await s.setItem("key", generateRandomString(10));

  // const db = useDrizzle();
  // console.log("Selecting from db");
  // debugger;
  // const x = await db.select().from(organizationSchema);
  // await db.insert(organizationSchema).values({
  //   name: "Tring",
  //   metadata: {
  //     name: "Tring",
  //     data: { any: "any" },
  //   },
  // });
});
