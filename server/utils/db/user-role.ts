import { InsertUserRole } from "~/server/schema/auth";
const db = useDrizzle();

export const createUserRole = async (role: InsertUserRole) => {
  const newUserRole = await db
    .insert(authUserRoleSchema)
    .values(role)
    .returning();
  return newUserRole[0];
};

export const updateUserRoleById = async (id: string, role: any) => {
  return (
    await db.update(authUserRoleSchema)
    .set(role)
    .where(eq(authUserRoleSchema.id, id))
    .returning()
  )[0]
}

export const getUserRoleById = async (id: string) => {
  const role = await db.query.authUserRoleSchema.findFirst({
    where: eq(authUserRoleSchema.id, id),
  });
  if (!role) return null;

  return role;
};

export const getAllUserRolesByOrgId = async (organizationId: string, query?: any) => {
  let page, offset:any, limit = 0;
  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }

  const conditions = [
    eq(authUserRoleSchema.organizationId, organizationId),
    ne(authUserRoleSchema.role, "admin"),
  ];
  
  if (query?.q) {
    conditions.push(
      like(authUserRoleSchema.role, `%${query.q}%`) // This simulates the regex behavior
    );
  }
  
  const data = await db.query.authUserRoleSchema.findMany({
    where: and(...conditions),
    orderBy: [desc(authUserRoleSchema.createdAt)],
  });

  if (query?.page && query?.limit) {
    const paginatedOrgUsers = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedOrgUsers,
    };
  } else {
    return data;
  }
};

export const isRoleExists = async (role: string, organizationId:string) => {
  const isExistsRole = await db.query.authUserRoleSchema.findFirst({
    where: and(
      eq(authUserRoleSchema.role, role),
      eq(authUserRoleSchema.organizationId, organizationId),
    )
  })
  return !!isExistsRole
}

export const deleteUserRoleById = async (id: string) => {
  return (
    await db.delete(authUserRoleSchema)
    .where(eq(authUserRoleSchema.id, id))
    .returning()
  )[0]
}

