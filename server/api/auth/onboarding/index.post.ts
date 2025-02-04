import { createOrgSubscription } from "~/server/utils/db/organization";
import { createZohoCustomer } from "~/server/utils/zoho/customer";

const db = useDrizzle();

const bodyValidationSchema = z.object({
  name: z.string().min(1),
  companyName: z.string().min(1),
  mobile: z.string(),
  countryCode: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, bodyValidationSchema);

  const userId = event.context.user?.id;
  if (!userId)
    return sendError(
      event,
      createError({
        statusCode: 404,
        statusMessage:
          "User Not Found: The specified user could not be located.",
      }),
    );

  const org = await createOrganization({
    name: body.companyName,
  });

  const updatedUser = await updateUser(userId, {
    username: body.name,
    organizationId: org.id,
    countryCode: body?.countryCode,
    mobile: body?.mobile,
  });

  // create default buckets and free-plan subscription
  await Promise.all([
    createContactList({
      name: "leads contacts",
      organizationId: org.id,
      isDefault: true,
    }),
    createOrgSubscription([
      {
        organizationId: org.id,
        botType: "chat",
        planCode: "chat_free",
        status: "active",
      },
      {
        organizationId: org.id,
        botType: "voice",
        planCode: "voice_free",
        status: "active",
      },
    ]),
  ]);

  if (process.env.ENV_TYPE !== "stage") {
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
            <p>Mobile: ${updatedUser.countryCode} ${updatedUser.mobile}</p>
          </div>
        <p>Best,<br>support@tringlabs.ai</p>
      </div>`,
    );
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
    </div>`,
  );

  const zohoData: any = await db.query.adminConfigurationSchema.findFirst({
    where: eq(adminConfigurationSchema.id, 1),
  });
  let metaData = zohoData?.metaData;
  if (metaData) {
    // create customer in zoho
    const zohoCustomer = await createZohoCustomer(metaData, updatedUser);
    if (zohoCustomer) {
      // update the zoho-customer-id in user schema
      await updateUser(userId, {
        customerId: zohoCustomer?.data?.customer?.customer_id,
      });
    }
  }
});
