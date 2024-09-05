import { Argon2id } from "oslo/password";

const bodyValidator = z
  .object({
    username: z.string().min(2, "Name must be at least 2 characters.").optional(),
    email: z.string().email().default("").optional(),
    password: z.string().optional().default(""),
    address: z.record(z.any()).optional()
  })
  .passthrough();

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);

  const body = await isValidBodyHandler(event, bodyValidator);

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
    username: body.username,
    email: body.email,
    ...(newPassword && { password: newPassword }),
    address: body.address
  };

  const update = await updateUser(user.id, updatedUser);

  return update
});
