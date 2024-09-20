import { updateOrgUserById } from "~/server/utils/db/user"

const db = useDrizzle()

const zodUpdateValidator = z.object({
   name: z.string().optional(),
   countryCode: z.string().optional(),
   mobile: z.string().optional(),
   email: z.string().optional(),
   password: z.string().optional(),
   roleId: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const organization_id = (await isOrganizationAdminHandler(event)) as string

  const { id: orgUserId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body = await isValidBodyHandler(event, zodUpdateValidator)

  const isAlreadyExists = await db.query.authUserSchema.findFirst({
    where: and(
      eq(authUserSchema.organizationId, organization_id),
      eq(authUserSchema.email, body.email),
      ne(authUserSchema.id, orgUserId)
    )
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

  const data =  await updateOrgUserById(orgUserId, {
    ...body,
    username: body?.name
  })

  return data
})