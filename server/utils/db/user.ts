const db = useDrizzle();

export const getAdminByOrgId = async (orgId: string) => {
  return await db.query.authUserSchema.findFirst({
    where: and(
      eq(authUserSchema.organizationId, orgId),
      eq(authUserSchema.role, "admin"),
    ),
  });
};
