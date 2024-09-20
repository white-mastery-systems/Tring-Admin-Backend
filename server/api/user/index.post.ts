import { createOrgUser } from "~/server/utils/db/user";

const db = useDrizzle()

const zodBodyValidator = z.object({
   name: z.string(),
   countryCode: z.string(),
   mobile: z.string(),
   email: z.string(),
   password: z.string(),
   roleId: z.string()
})

export default defineEventHandler(async (event) => {
  const organization_id = (await isOrganizationAdminHandler(event)) as string;
  
  const body = await isValidBodyHandler(event, zodBodyValidator)

  const isAlreadyExists = await db.query.authUserSchema.findFirst({
    where: and(
      eq(authUserSchema.organizationId, organization_id),
      eq(authUserSchema.email, body.email))
  })

  if(isAlreadyExists) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Email already exists",
      }),
    );
  }
  
  const data = await createOrgUser( 
    {
    ...body,
    username: body.name,
    role: "user",
    organizationId: organization_id
  })

  return isValidReturnType(event, data)
})