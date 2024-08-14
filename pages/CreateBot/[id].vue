<script setup lang="ts">
  const formSchema = toTypedSchema(
    z
      .object({
        NAME: z.string().min(2, "Name must be at least 2 characters."),
        COMPANY_NAME: z
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
            <UiFormLabel>Name</UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" type="text" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="COMPANY_NAME">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel>Company Name</UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" type="text" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
      </div>
      <div class="flex gap-4">
        <UiFormField v-slot="{ componentField }" name="ROLE">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel>Role</UiFormLabel>
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
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="GOAL">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel>Goal</UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" type="text" />
            </UiFormControl>
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
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <UiFormField v-slot="{ componentField }" name="DESCRIPTION">
        <UiFormItem v-auto-animate="animationProps">
          <UiFormLabel>Description</UiFormLabel>
          <UiFormControl>
            <UiTextarea v-bind="componentField" type="text" />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <UiButton type="submit" class="">Submit</UiButton>
    </UiForm>
  </div>
</template>
