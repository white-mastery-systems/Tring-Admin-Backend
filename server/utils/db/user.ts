import jwt from "jsonwebtoken";
import { Argon2id } from "oslo/password";
import { logger } from "~/server/logger";
import { resetPasswordEmailTemplate } from "../email-templates";

const config = useRuntimeConfig();
const db = useDrizzle();

export const getAdminByOrgId = async (orgId: string) => {
  return await db.query.authUserSchema.findFirst({
    where: and(
      eq(authUserSchema.organizationId, orgId),
      eq(authUserSchema.role, "admin"),
    ),
  });
};

export const requestResetPassword = (userDetails: any) => {
  try {
    const token = jwt.sign({ userId: userDetails?.id }, config?.secretKey, {
      expiresIn: "5m",
    });
    // return token

    const subject = "Reset Password";

    const message = resetPasswordEmailTemplate(userDetails, token, config)

    sendEmail(userDetails?.email, subject, message);

    return { status: true };
  } catch (error: any) {
    logger.error({ level: "error", message: error.message });
    return { status: false };
  }
};

export const updatePassword = async (userId: string, userDetails: any) => {
  const hashedNewPassword = await new Argon2id().hash(userDetails?.newPassword);
  return (
    await db
      .update(authUserSchema)
      .set({
        password: hashedNewPassword,
        updatedAt: new Date(),
      })
      .where(eq(authUserSchema.id, userId))
      .returning()
  )[0];
};


// Users
export const createOrgUser = async (user: any) => {
  const hashedPassword = await new Argon2id().hash(user?.password);
  return (
    await db.insert(authUserSchema)
    .values({
      ...user,
      password: hashedPassword
    })
    .returning()
  )[0]
}

export const getOrgUsers = async (orgId: string, query?: any) => {
  let page, offset, limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }

  let data: any = await db.query.authUserSchema.findMany({
    where: and(
      eq(authUserSchema.organizationId, orgId),
      ne(authUserSchema.role, "admin"),
      query?.q ? ilike(authUserSchema.username, `%${query.q}%`) : undefined
    ),
    orderBy: [desc(authUserSchema.createdAt)]
  })
   
  data = data.map(({ password, ...rest }: any) => rest);

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
}

export const getOrgUserById = async (orgUserId: string) => {
  const data: any = await db.query.authUserSchema.findFirst({
    where: eq(authUserSchema.id, orgUserId)
  })

  const { password, ...rest } = data
  
  return rest
}

export const updateOrgUserById = async (orgUserId: string, user: any) => {
  const hashedPassword = await new Argon2id().hash(user?.password);
  return (
    await db.update(authUserSchema)
    .set({
      ...user,
      password: hashedPassword,
    })
    .where(eq(authUserSchema.id, orgUserId))
    .returning()
  )[0]
}

export const deleteOrgUserById = async (orgUserId: string) => {
  return (
    await db.delete(authUserSchema)
    .where(eq(authUserSchema.id, orgUserId))
    .returning()
  )[0]
}