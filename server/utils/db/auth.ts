import { Argon2id } from "oslo/password";

const db = useDrizzle();

export const createUser = async (user: InsertUser) => {
  const hashedPassword = await new Argon2id().hash(user.password);

  const newUser = await db
    .insert(authUserSchema)
    .values({ ...user, password: hashedPassword })
    .returning();

  return newUser[0];
};

export const ifUserAlreadyExists = async (username: string, email: string) => {
  const isUserExists = await db.query.authUserSchema.findFirst({
    where: or(
      eq(authUserSchema.username, username),
      eq(authUserSchema.email, email),
    ),
  });

  return !!isUserExists;
};

export const getUserByUsernameAndEmail = async ({
  email,
  password,
}: {
  email: string;
  password?: string;
}) => {
  const user = await db.query.authUserSchema.findFirst({
    where: or(
      eq(authUserSchema.username, email),
      eq(authUserSchema.email, email),
    ),
  });

  if (!user) {
    return null;
  }

  if (!password) return user;

  const isPasswordValid = await new Argon2id().verify(user.password, password);
  if (!isPasswordValid) {
    return null;
  }

  const { password: _, ...rest } = user;
  return rest;
};

export const getUserById = async (id: string) => {
  const user = await db.query.authUserSchema.findFirst({
    where: eq(authUserSchema.id, id),
  });

  if (!user) {
    return null;
  }

  const { password: _, ...rest } = user;
  return rest;
};

export const updateUser = async (id: string, user: Partial<InsertUser>) => {
  return (
    await db
      .update(authUserSchema)
      .set({
        ...user,
        updatedAt: new Date(),
      })
      .where(eq(authUserSchema.id, id))
      .returning()
  )[0];
};
