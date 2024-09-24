import { createOrgUser } from "~/server/utils/db/user";
import { createContactPerson } from "~/server/utils/zoho/contact-person";

const db = useDrizzle()

const zodBodyValidator = z.object({
   name: z.string(),
   countryCode: z.string(),
   mobile: z.string(),
   email: z.string(),
   password: z.string(),
   roleId: z.string().optional()
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
 
  if(data) {
    const zohoData: any = await db.query.adminConfigurationSchema.findFirst({
      where: eq(adminConfigurationSchema.id, 1),
    });
    let metaData = zohoData?.metaData
    const zohoContactPerson = await createContactPerson(organization_id, data, metaData)

    if(zohoContactPerson?.status) {
      await db
        .update(authUserSchema)
        .set({ contactPersonId: zohoContactPerson?.data?.contactperson?.contactperson_id })
        .where(eq(authUserSchema.id, data.id))
    }
  }
  return isValidReturnType(event, data)
})