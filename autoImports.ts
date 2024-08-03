const drizzleOrm = {
  from: "drizzle-orm",
  imports: [
    "and",
    "eq",
    "exists",
    "gt",
    "gte",
    "lt",
    "lte",
    "ne",
    "not",
    "notExists",
    "or",
    "relations",
    "sql",
    "desc",
    "asc",
    { name: "InferInsertModel", type: true },
    { name: "InferSelectModel", type: true },
  ],
};

const drizzleZod = {
  from: "drizzle-zod",
  imports: [
    { name: "createInsertSchema", as: "createZodInsertSchema" },
    { name: "createSelectSchema", as: "createZodSelectSchema" },
  ],
};

const zod = {
  from: "zod",
  imports: ["z"],
};

const veeValidateZod = {
  from: "@vee-validate/zod",
  imports: ["toTypedSchema"],
};

const vueSonner = {
  from: "vue-sonner",
  imports: ["toast"],
};

export default {
  nitro: [drizzleOrm, drizzleZod, zod],
  nuxt: [zod, veeValidateZod, vueSonner],
};
