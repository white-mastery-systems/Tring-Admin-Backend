import { createOrgSubscription } from "~/server/utils/db/organization";
import { createZohoCustomer } from "~/server/utils/zoho/customer";

const db = useDrizzle()
const config = useRuntimeConfig();

const bodyValidationSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  otherRole: z.string().optional(),
  companyName: z.string().min(1),
  industry: z.string().min(1),
  industryOtherRole: z.string().optional(),
  avgTraffic: z.string().min(1),
  employeeCount: z.string().min(1),
  planToBuild: z.string(),
  referralSource: z.string(),
  estimatedMonthlyBudget: z.string(),
  discoverySource: z.string(),
  businessName: z.string(),
  country: z.string(),
  mobile: z.string(),
  countryCode: z.string(),
  otherPlan: z.string().optional(),
  otherReferralSource: z.string().optional(),
  otherEstimatedMonthlyBudget: z.string().optional(),
  otherDiscoverySource: z.string().optional(),
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
      otherRole: body?.industryOtherRole,
      planToBuild: body?.planToBuild,
      referralSource: body?.referralSource,
      estimatedMonthlyBudget: body?.estimatedMonthlyBudget,
      discoverySource: body?.discoverySource,
      otherPlan: body?.otherPlan,
      otherReferralSource: body?.otherReferralSource,
      otherEstimatedMonthlyBudget: body?.otherEstimatedMonthlyBudget,
      otherDiscoverySource: body?.otherDiscoverySource
    },
  });

  const updatedUser = await updateUser(userId, {
    username: body.name,
    organizationId: org.id,
    countryCode: body?.countryCode,
    mobile: body?.mobile,
    metadata: {
      role: body.role,
      otherRole: body?.otherRole,
      businessName: body?.businessName
    },
    address: {
      country: body?.country
    }
  });

  // create default buckets and free-plan subscription
  await Promise.all([
    createContactList({
    name: "leads contacts",
    organizationId: org.id,
    isDefault: true
  }),
    createOrgSubscription(
    [
     { organizationId: org.id, botType: "chat", planCode: "chat_free", status: "active" },
     { organizationId: org.id, botType: "voice", planCode: "voice_free", status: "active" }
    ]
  )
  ]) 
 
  if(config?.envType !== "stage") {
    sendEmail(
      "rianozal@tringlabs.ai", // to
      `Welcome aboard: ${org.name}`, // subject
      `<div>                             
        <p>Hi</p> 
        <p><strong>${updatedUser.username}</strong> just started their journey with Tring AI.</p> 
        <p>Greetings are sent, and onboarding is in progress.</p>
        <div>
          <p><strong>User Details:</strong></p>
          <p>Name: ${updatedUser.username}</p>
          <p>Email: ${updatedUser.email}</p>
          <p>Role: ${updatedUser?.metadata?.role || updatedUser?.metadata?.otherRole}</p>
          <p>Industry: ${org.metadata?.industry || org?.metadata?.otherRole }</p>
          </div>
        <p>Best,<br>support@tringlabs.ai</p>
      </div>`
    )
  }

   sendEmail(
    updatedUser.email, // to
     "Welcome To Tring AI !!", // subject
    `<div>
       <p>Hi <strong>${updatedUser?.username}</strong>,</p>
       <p>Welcome to Tringlabs.ai🎉</p>
        <p>Wohoo!! We’re Excited to Have You Onboard 🎉</p>
        <p>We're thrilled to welcome you to Tring AI - your hub for creating captivating conversational voice and chat agents, designed to help you achieve your revenue goals. Here’s to smarter customer service!</p>
        <p>In just a few simple steps, you'll be on your way to making waves in the world of communication.</p>
       <p>Cheers,<br>Rian Ozal</p>
    </div>`)

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
