import { createOrgUser } from "~/server/utils/db/user";
import { createContactPerson } from "~/server/utils/zoho/contact-person";

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
    where: eq(authUserSchema.email, body.email)
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

  if(data) {
    sendEmail(data?.email, "Login credentials", `email: ${data?.email}, password: ${body?.password}`)
    // Checking permission
    const userRolePermission = await db.query.authUserRoleSchema.findFirst({
      where: eq(authUserRoleSchema.id, data.roleId)
    })
    
    if(userRolePermission.permissions.sendEmail === true) {
      const zohoData: any = await db.query.adminConfigurationSchema.findFirst({
        where: eq(adminConfigurationSchema.id, 1),
      });
      let metaData = zohoData?.metaData
      if (metaData) {
        let customerId
        const customer = await db.query.authUserSchema.findFirst({
            where: and(
              eq(authUserSchema.organizationId, organization_id),
              eq(authUserSchema.role, "admin")
            ) 
        })
        if(!customer?.customerId) {
            // create customer in zoho
          const zohoCustomer = await createZohoCustomer(metaData, customer)
          if(zohoCustomer) {
            customerId = zohoCustomer?.data?.customer?.customer_id
            // update the zoho-customer-id in user schema
            await updateUser(customer?.id, {
              customerId
            });
          }
        } else {
          customerId = customer?.customerId
        }
        const zohoContactPerson = await createContactPerson(organization_id, data, metaData, customerId)

        if(zohoContactPerson?.status) {
          await db
            .update(authUserSchema)
            .set({ contactPersonId: zohoContactPerson?.data?.contactperson?.contactperson_id })
            .where(eq(authUserSchema.id, data.id))
        }
      }
    }
  }
 
  return isValidReturnType(event, data)
})