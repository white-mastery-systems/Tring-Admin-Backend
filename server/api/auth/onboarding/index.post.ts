import { createZohoCustomer } from "~/server/utils/zoho/customer";

const db = useDrizzle()

const bodyValidationSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  otherRole: z.string().optional(),
  companyName: z.string().min(1),
  industry: z.string().min(1),
  industryOtherRole: z.string().optional(),
  avgTraffic: z.string().min(1),
  employeeCount: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, bodyValidationSchema);

  const userId = event.context.user?.id;
  if (!userId)
    return sendError(
      event,
      createError({ statusCode: 404, statusMessage: "Invalid User" }),
    );

  const org = await createOrganization({
    name: body.companyName,
    metadata: {
      industry: body.industry,
      avgTraffic: body.avgTraffic,
      employeeCount: body.employeeCount,
      otherRole: body?.industryOtherRole
    },
  });

  const updatedUser = await updateUser(userId, {
    username: body.name,
    organizationId: org.id,
    metadata: {
      role: body.role,
      otherRole: body?.otherRole
    },
  });

  // create default buckets
  await createContactList({
    name: "leads contacts",
    organizationId: org.id,
    isDefault: true
  })

  const zohoData: any = await db.query.adminConfigurationSchema.findFirst({
    where: eq(adminConfigurationSchema.id, 1),
  });
  let metaData = zohoData?.metaData
  if(metaData) {
    // create customer in zoho
    const zohoCustomer = await createZohoCustomer(metaData, updatedUser)
    if(zohoCustomer) {
       // update the zoho-customer-id in user schema
      await updateUser(userId, {
        customerId: zohoCustomer?.data?.customer?.customer_id
      });
    }
  }
});
