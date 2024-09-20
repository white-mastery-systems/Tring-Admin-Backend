import { Argon2id } from "oslo/password";

const db = useDrizzle()

const bodyValidator = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters.").optional(),
    email: z.string().email().default("").optional(),
    password: z.string().optional().default(""),
    address: z.record(z.any()).optional(),
    mobile: z.string().optional(),
    countryCode: z.string().optional(),
  })
  .passthrough();

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const userId = event.context.user?.id as string

  const body = await isValidBodyHandler(event, bodyValidator);

  // console.log({ userId })

  const isEmailAlreadyExists = await db.query.authUserSchema.findFirst({
    where: and (
      ne(authUserSchema.id, userId),
      eq(authUserSchema.email, body?.email)
    )
  })

  if(isEmailAlreadyExists) {
     return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Email already exists",
      }),
    );
  }

  const user = event.context.user;
  if (!user)
    return sendError(
      event,
      createError({ statusCode: 404, statusMessage: "Unauthorized" }),
    );

  const newPassword = body.password
    ? await new Argon2id().hash(body.password)
    : undefined;


  const updatedUser = {
    username: body.name,
    email: body.email,
    ...(newPassword && { password: newPassword }),
    metadata: body.metadata,
    address: body.address,
    mobile: body.mobile,
    countryCode: body.countryCode
  };

  const update = await updateUser(user.id, updatedUser);

  return update
});
