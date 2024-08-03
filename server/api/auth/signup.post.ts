export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body: any) =>
    zodSignUpSchema.safeParse({ ...body, role: "user" }),
  );

  if (body.success === false)
    return sendError(
      event,
      createError({
        statusCode: 400,
        message: "Invalid User Data",
        data: body.error.format(),
      }),
    );

  debugger;

  const isUserExists = await ifUserAlreadyExists(
    body.data.username,
    body.data.email,
  );
  if (isUserExists)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "User already exists",
      }),
    );

  let orgId = "";
  // if (body.data.organizationName !== "WMS") {
  const org = await createOrganization({
    name: body.data.organizationName,
    description: body.data.organizationDescription,
  });
  orgId = org.id;
  // } else {
  //   orgId = "6d9a816d-c210-4f6b-b16c-f8d9d121df75";
  // }

  const user = await createUser({
    username: body.data.username,
    email: body.data.email,
    password: body.data.password,
    role: "user",
    organizationId: orgId,
  });
  const session = await lucia.createSession(user.id, {});
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize(),
  );
  setResponseStatus(event, 201);
  return { status: "User created successfully" };
});
