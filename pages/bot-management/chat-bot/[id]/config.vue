<script setup lang="ts">
const showIntentDialog = ref(false);

const formSchema = toTypedSchema(
  z
    .object({
      NAME: z
        .string({ required_error: "Name must be at least 2 characters." })
        .min(2, "Name must be at least 2 characters."),
      COMPANY: z
        .string({
          required_error: "Company name must be at least 2 characters.",
        })
        .min(2, "Company name must be at least 2 characters."),

      ROLE: z
        .string({ required_error: "Role must be provided." })
        .min(2, "Role must be provided."),
      GOAL: z
        .string({ required_error: "Goal must be provided." })
        .min(2, "Goal must be provided."),
      NOTES: z.string().optional().default(""),
      DESCRIPTION: z.string().optional().default(""),
      otherRole: z.string().optional().default(""),
      otherGoal: z.string().optional().default(""),
      errorMessage: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.ROLE.toLowerCase() === "other") {
          return data.otherRole.length >= 1;
        }
        return true;
      },
      {
        message: "Other role must be provided",
        path: ["otherRole"],
      },
    )
    .refine(
      (data) => {
        if (data.GOAL.toLowerCase() === "other") {
          return data.otherGoal.length >= 1;
        }
        return true;
      },
      {
        message: "Other goal must be provided",
        path: ["otherGoal"],
      },
    )
    .transform((data) => {
      if (data.ROLE.toLowerCase() === "other") {
        return { ...data, ROLE: data.otherRole };
      }
      if (data.GOAL.toLowerCase() === "other") {
        return { ...data, GOAL: data.otherGoal };
      }
      return data;
    }),
);

const animationProps = {
  duration: 0,
};
const router = useRouter();
const route = useRoute("bot-management-chat-bot-id-config");

const roles = ref<any>([
  {
    helperText: "Handles sales inquiries and closes deals.",
    label: "Sales Executive",
    value: "Sales Executive",
  },
  {
    helperText: "Provides assistance and resolves customer issues.",
    label: "Customer Support Representative.",
    value: "Customer Support Representative",
  },
  {
    helperText: "Performs miscellaneous tasks as required.",
    label: "Other",
    value: "Other",
  },
]);

const goals = ref<any>([
  {
    helperText: "Assist customers with their questions and issues.",
    label: "Customer Support",
    value: "Customer Support",
  },
  {
    helperText: "Collect feedback from users to improve services.",
    label: "Feedback Collection",
    value: "Feedback Collection",
  },
  {
    helperText: "Manage appointments and schedule meetings.",
    label: "Appointment Scheduling",
    value: "Appointment Scheduling",
  },
  {
    helperText: "Provide education or training on specific topics.",
    label: "Education/Training",
    value: "Education/Training",
  },
  {
    helperText: "Perform other custom tasks as needed.",
    label: "Other",
    value: "Other",
  },
]);

const botDetails: any = await getBotDetails(route.params.id);
const defaultFormValues = botDetails.metadata.prompt;

const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: formSchema,
});

setFieldValue("NAME", defaultFormValues.NAME || "");
setFieldValue("COMPANY", defaultFormValues.COMPANY || "");
setFieldValue("ROLE", defaultFormValues.ROLE || "");
setFieldValue("GOAL", defaultFormValues.GOAL || "");
setFieldValue("NOTES", defaultFormValues.NOTES || "");
setFieldValue("DESCRIPTION", defaultFormValues.DESCRIPTION || "");
setFieldValue("otherRole", defaultFormValues.otherRole || "");
setFieldValue("otherGoal", defaultFormValues.otherGoal || "");
setFieldValue("errorMessage", defaultFormValues.errorMessage || "");

watchEffect(() => {
  if (botDetails) {
    const userName = botDetails?.name ?? 'Unknown Bot Name';
    useHead({
      title: `Chat Bot | ${userName} - Bot Config`,
    });
  }
});

const handleUpdateBotConfig = handleSubmit(async (values: any) => {
  const payload: any = {
    id: botDetails.id,
    metadata: {
      ...botDetails.metadata,
      prompt: {
        ...values,
      },
    },
  };
  await updateBotDetails(payload);
  return navigateTo({
    name: "bot-management-chat-bot-id",
    params: { id: botDetails.id },
  });
});
</script>
<template>
  <Page title="Bot Configuration" :bread-crumbs="[
    {
      label: `${botDetails.name}`,
      to: `/bot-management/chat-bot/${botDetails.id}`,
    },
    {
      label: 'Bot Configuration',
      to: `/bot-management/chat-bot/${botDetails.id}/config`,
    },
  ]" :description="true" :disableSelector="false" :disable-back-button="false">
    <div class="mx-5 gap-3">
      <form @submit="handleUpdateBotConfig" class="space-y-3">
        <div class="flex gap-4">
          <TextField name="NAME" label="Bot Name" placeholder="Eg. Noah,Bob,Chris,Ted" required>
          </TextField>
          <TextField name="COMPANY" label="Company Name" placeholder="Eg. Google, Amazon" required>
          </TextField>
        </div>
        <div class="flex gap-4">
          <div class="w-full">
            <SelectField name="ROLE" label="Bot's Role" placeholder="Select Role"
              helperText="This will determine the role of the bot and behavior." :options="roles" required />
            <TextField v-if="values.ROLE === 'Other'" name="otherRole" helperText="enter role of your bot" required>
            </TextField>
          </div>
          <div class="w-full">
            <SelectField name="GOAL" label="Bot's Goal" placeholder="Select Goal"
              helperText="The bot will be driving the conversation towards this goal." :options="goals" required />
            <TextField v-if="values.GOAL === 'Other'" name="otherGoal" required helperText="enter goal of your bot">
            </TextField>
          </div>
        </div>
        <TextField isTextarea="true" name="errorMessage" placeholder="enter error message"
          helperText="Enter a error mesage that will be shown a error when bot failed  " required />
        <TextField name="NOTES" label="Notes" helperText="Here you can have additional instructions for your bot."
          :isTextarea="true">
        </TextField>
        <TextField name="DESCRIPTION" label="Company Description" helperText="Here you can give the bot additional details about your
              company." :isTextarea="true">
        </TextField>
        <div class="flex w-full justify-end">
          <UiButton color="primary" type="submit">Submit</UiButton>
        </div>
      </form>
    </div>
  </Page>
</template>
