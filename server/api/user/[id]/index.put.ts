import { updateOrgUserById } from "~/server/utils/db/user"
import { updateContactPerson } from "~/server/utils/zoho/contact-person"

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

  if(data?.contactPersonId) {
    const zohoData: any = await db.query.adminConfigurationSchema.findFirst({
      where: eq(adminConfigurationSchema.id, 1),
    });
    let metaData = zohoData?.metaData

    // get customer_id
    const customer = await db.query.paymentSchema.findFirst({
      where: eq(paymentSchema.organizationId, organization_id)
    })
    if(!customer) {
       return { status: false }
    }
    const customerId = customer?.customerId

    await updateContactPerson(organization_id, data, metaData, customerId, data.contactPersonId)
   
  }

  return isValidReturnType(event, data)
})