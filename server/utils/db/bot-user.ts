const db = useDrizzle();

export const getBotUserById = async (id: string, orgId: string) =>
  await db.query.botUserSchema.findFirst({
    where: and(
      eq(botUserSchema.id, id),
      eq(botUserSchema.organizationId, orgId),
    ),
  });


export const updateBotUser = async ( id: string, integrationData: any) => {
  await db.update(botUserSchema).set({
    metaData: integrationData,
    updatedAt: new Date()
  }).where (eq(botUserSchema.id, id))
}

export const getBotUserByPhone = async (
  phone: string,
  countryCode: string,
  orgId: string,
  userType: "voicebot" | "chatbot" | "whatsapp" = "chatbot",
) => {
  return await db.query.botUserSchema.findFirst({
    where: and(
      eq(botUserSchema.mobile, phone),
      eq(botUserSchema.organizationId, orgId),
      eq(botUserSchema.userType, userType),
    ),
  });
};

export const upsertBotUser = async (
  data: InsertBotUser,
): Promise<SelectBotUser> => {
  // First, check if a user with the given mobile number exists
  const existingUserByMobile = await db.query.botUserSchema.findFirst({
    where: and(
      eq(botUserSchema.mobile, data.mobile ?? ""),
      eq(botUserSchema.organizationId, data.organizationId),
      eq(botUserSchema.userType, data.userType ?? "chatbot"),
    ),
  });

  // Case 1: If the mobile number is new, add as a new user
  if (!existingUserByMobile) {
    return (await db.insert(botUserSchema).values(data).returning())[0];
  }

  // Case 2 & 3: User with the mobile number exists, handle email
  const updatedData: Partial<InsertBotUser> = {};

  if (data.email && data.email !== existingUserByMobile.email) {
    // Create a Set from existing secondary emails for efficient lookup
    const secondaryEmailSet = new Set(existingUserByMobile.secondaryEmail);

    // Check if the email already exists in the secondary emails
    if (!secondaryEmailSet.has(data.email)) {
      updatedData.secondaryEmail = [
        ...(existingUserByMobile.secondaryEmail ?? []),
        data.email,
      ].filter(
        (email): email is string =>
          email !== null && email !== existingUserByMobile.email,
      );
    }
  }

  // If there are no changes (Case 3), don't update anything
  if (Object.keys(updatedData).length === 0) {
    return existingUserByMobile;
  }

  // Update the user with new secondary email (if any)
  return (
    await db
      .update(botUserSchema)
      .set(updatedData)
      .where(eq(botUserSchema.id, existingUserByMobile.id))
      .returning()
  )[0];
};

export const fetchUserByPhoneOrCreate = async (
  phone: string,
  orgId: string,
  userType: "voicebot" | "chatbot" | "whatsapp" = "chatbot",
  name?: string,
) => {
  let countryCode = phone?.substring(0, 2);
  phone = phone.slice(2);
  const user = await getBotUserByPhone(phone, countryCode, orgId, userType);
  if (user) {
    return user;
  }

  return upsertBotUser({
    mobile: phone,
    countryCode: `+${countryCode}`,
    name: name || "",
    organizationId: orgId,
    userType,
    isNameVerified: false,
  });
};