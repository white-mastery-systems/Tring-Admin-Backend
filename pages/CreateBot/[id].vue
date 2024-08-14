<script setup lang="ts">
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
      .transform((data) => {
        if (data.ROLE.toLowerCase() === "other") {
          return { ...data, role: data.otherRole };
        }
        return data;
      }),
  );

  const animationProps = {
    duration: 500,
  };
  const router = useRouter();
  const route = useRoute("CreateBot-id");

  const roles = ["Sales Executive", "Customer Support Representative", "Other"];

  const botDetails: any = await getBotDetails(route.params.id);
  const defaultFormValues = botDetails.metadata.prompt;

  const handleSubmit = async (values: any) => {
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
      name: "BotManagementDetails-id",
      params: { id: botDetails.id },
    });
  };
</script>
<template>
  <div class="mx-5 mb-4 mt-2 flex items-center gap-2">
    <UiButton variant="ghost" size="icon" @click="router.back()">
      <Icon name="ic:round-arrow-back-ios-new" class="h-5 w-5" />
    </UiButton>
    <UiLabel class="text-[20px] font-bold">Bot Configuration</UiLabel>
  </div>
  <div class="mx-5">
    <UiForm
      :validation-schema="formSchema"
      :keep-values="true"
      :validate-on-mount="false"
      :initial-values="defaultFormValues"
      class="space-y-2"
      @submit="handleSubmit"
    >
      <div class="flex gap-4">
        <UiFormField v-slot="{ componentField }" name="NAME">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel>Bot Name *</UiFormLabel>
            <UiFormControl>
              <UiInput
                v-bind="componentField"
                type="text"
                placeholder="Eg. Zia, Siri, Alexa"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="COMPANY">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel>Company Name *</UiFormLabel>
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
            <UiFormLabel>Bot's Role *</UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField">
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select Role" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem v-for="(role, index) in roles" :value="role">{{
                    role
                  }}</UiSelectItem>
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
            <UiFormDescription>
              This will determine the role of the bot and items-center behavior.
            </UiFormDescription>
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="GOAL">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel>Goal *</UiFormLabel>
            <UiFormControl>
              <UiInput
                v-bind="componentField"
                type="text"
                placeholder="Eg. To assist the users with the product details"
              />
            </UiFormControl>
            <UiFormDescription>
              The bot will be driving the conversation towards this goal.
            </UiFormDescription>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
      </div>
      <UiFormField v-slot="{ componentField }" name="notes">
        <UiFormItem v-auto-animate="animationProps">
          <UiFormLabel>Notes</UiFormLabel>
          <UiFormControl>
            <UiTextarea v-bind="componentField" type="text" />
          </UiFormControl>
          <UiFormDescription>
            Here you can have additional instructions for your bot.
          </UiFormDescription>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <UiFormField v-slot="{ componentField }" name="DESCRIPTION">
        <UiFormItem v-auto-animate="animationProps">
          <UiFormLabel>Company Description</UiFormLabel>
          <UiFormControl>
            <UiTextarea v-bind="componentField" type="text" />
          </UiFormControl>
          <UiFormDescription>
            Here you can give the bot additional details about your company.
          </UiFormDescription>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <UiButton
        type="submit"
        class="bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110"
        size="lg"
        >Submit</UiButton
      >
    </UiForm>
  </div>
</template>
