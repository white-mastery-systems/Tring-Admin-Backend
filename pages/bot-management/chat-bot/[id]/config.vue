<script setup lang="ts">
  const showIntentDialog = ref(false);
  const formSchema = toTypedSchema(
    z
      .object({
        NAME: z.string().min(2, "Name must be at least 2 characters."),
        COMPANY: z
          .string()
          .min(2, "Company name must be at least 2 characters."),

        ROLE: z.string().min(2, "Role must be provided."),
        GOAL: z.string().min(2, "Goal must be provided."),
        NOTES: z.string().optional().default(""),
        DESCRIPTION: z.string().optional().default(""),
        otherRole: z.string().optional().default(""),
        otherGoal: z.string().optional().default(""),
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
  const route = useRoute("bots-id-config");

  const roles = [
    {
      label: "Handles sales inquiries and closes deals.",
      value: "Sales Executive",
    },
    {
      label: "Provides assistance and resolves customer issues.",
      value: "Customer Support Representative",
    },
    { label: "Performs miscellaneous tasks as required.", value: "Other" },
  ];

  const goals = [
    {
      label: "Assist customers with their questions and issues.",
      value: "Customer Support",
    },
    {
      label: "Collect feedback from users to improve services.",
      value: "Feedback Collection",
    },
    {
      label: "Manage appointments and schedule meetings.",
      value: "Appointment Scheduling",
    },
    {
      label: "Provide education or training on specific topics.",
      value: "Education/Training",
    },
    {
      label: "Perform other custom tasks as needed.",
      value: "Other",
    },
  ];

  const botDetails: any = await getBotDetails(route.params.id);
  const defaultFormValues = botDetails.metadata.prompt;

  const handleUpdateBotConfig = async (values: any) => {
    console.log({ values });
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
  };
</script>
<template>
  <Page
    title="Bot Configuration"
    :bread-crumbs="[
      {
        label: `${botDetails.name}`,
        to: `/bot-management/chat-bot/${botDetails.id}`,
      },
      {
        label: 'Bot Configuration',
        to: `/bot-management/chat-bot/${botDetails.id}/config`,
      },
    ]"
    :description="true"
    :disableSelector="false"
    :disable-back-button="false"
  >
    <div class="mx-5">
      <UiForm
        v-slot="{ values, errors }"
        :validation-schema="formSchema"
        :keep-values="true"
        :validate-on-mount="false"
        :initial-values="defaultFormValues"
        class="space-y-2"
        @submit="handleUpdateBotConfig"
      >
        <div class="flex gap-4">
          <UiFormField v-slot="{ componentField }" name="NAME">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel
                >Bot Name <UiLabel class="text-lg text-red-500">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput
                  v-bind="componentField"
                  type="text"
                  placeholder="Eg. Noah,Bob,Chris,Ted"
                />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
          <UiFormField v-slot="{ componentField }" name="COMPANY">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel
                >Company Name <UiLabel class="text-lg text-red-500">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput
                  v-bind="componentField"
                  type="text"
                  placeholder="Eg. Google, Amazon"
                />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
        </div>
        <div class="flex gap-4">
          <UiFormField v-slot="{ componentField }" name="ROLE">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel
                >Bot's Role <UiLabel class="text-lg text-red-500">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiSelect v-bind="componentField">
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select Role" />
                  </UiSelectTrigger>
                  <UiSelectContent>
                    <div v-for="({ value, label }, index) in roles">
                      <UiSelectItem :value="value">{{ value }} </UiSelectItem>
                      <span class="mx-2 text-xs italic text-gray-500">{{
                        label
                      }}</span>
                    </div>
                    <!-- <UiSelectItem
                      v-for="({ value, label }, index) in roles"
                      :value="value"
                      >{{ value }}
                      <p class="text-xs italic text-gray-500">{{ label }}</p>
                    </UiSelectItem> -->
                  </UiSelectContent>
                </UiSelect>
                <UiFormField
                  v-if="componentField.modelValue === 'Other'"
                  v-slot="{ componentField }"
                  name="otherRole"
                >
                  <UiFormItem v-auto-animate="animationProps" class="w-full">
                    <UiFormControl>
                      <UiInput v-bind="componentField" type="text" />
                    </UiFormControl>
                    <UiFormMessage />
                  </UiFormItem>
                </UiFormField>
              </UiFormControl>
              <UiFormMessage />
              <span class="text-xs text-gray-500"
                >This will determine the role of the bot and behavior.</span
              >
            </UiFormItem>
          </UiFormField>
          <UiFormField v-slot="{ componentField }" name="GOAL">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel
                >Bot's Goal <UiLabel class="text-lg text-red-500">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiSelect v-bind="componentField">
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select Goal" />
                  </UiSelectTrigger>
                  <UiSelectContent>
                    <div v-for="({ value, label }, index) in goals">
                      <UiSelectItem :value="value">{{ value }} </UiSelectItem>
                      <span class="mx-2 text-xs italic text-gray-500">{{
                        label
                      }}</span>
                    </div>
                  </UiSelectContent>
                </UiSelect>
                <UiFormField
                  v-if="componentField.modelValue === 'Other'"
                  v-slot="{ componentField }"
                  name="otherGoal"
                >
                  <UiFormItem v-auto-animate="animationProps" class="w-full">
                    <UiFormControl>
                      <UiInput v-bind="componentField" type="text" />
                    </UiFormControl>
                    <UiFormMessage />
                  </UiFormItem>
                </UiFormField>
              </UiFormControl>
              <UiFormMessage />
              <span class="text-xs text-gray-500"
                >The bot will be driving the conversation towards this
                goal</span
              >
            </UiFormItem>
          </UiFormField>
          <!-- <UiFormField v-slot="{ componentField }" name="GOAL">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel
                >Goal <UiLabel class="text-lg text-red-500">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput
                  v-bind="componentField"
                  type="text"
                  placeholder="Eg. To assist the users with the product details"
                />
              </UiFormControl>
              <span class="text-xs text-gray-500"
                >The bot will be driving the conversation towards this
                goal.</span
              >
              <UiFormMessage />
            </UiFormItem>
          </UiFormField> -->
        </div>
        <UiFormField v-slot="{ componentField }" name="NOTES">
          <UiFormItem v-auto-animate="animationProps">
            <UiFormLabel>Notes</UiFormLabel>
            <UiFormControl>
              <UiTextarea v-bind="componentField" type="text" />
            </UiFormControl>
            <span class="text-xs text-gray-500"
              >Here you can have additional instructions for your bot.</span
            >
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="DESCRIPTION">
          <UiFormItem v-auto-animate="animationProps">
            <UiFormLabel>Company Description</UiFormLabel>
            <UiFormControl>
              <UiTextarea v-bind="componentField" type="text" />
            </UiFormControl>
            <span class="text-xs text-gray-500">
              Here you can give the bot additional details about your
              company.</span
            >
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <div class="flex w-full justify-end">
          <UiButton
            type="submit"
            class="bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110"
            size="lg"
            >Submit</UiButton
          >
        </div>
      </UiForm>
    </div>
  </Page>
</template>
