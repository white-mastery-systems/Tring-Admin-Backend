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
    duration: 0,
  };
  const router = useRouter();
  const route = useRoute("bots-id-config");

  const roles = ["Sales Executive", "Customer Support Representative", "Other"];

  const botDetails: any = await getBotDetails(route.params.id);
  const defaultFormValues = botDetails.metadata.prompt;

  const addIntents = async (values: any) => {
    const intentDetails: any = {
      id: botDetails.id,
      ...values,
    };
    await createBotIntents({
      intentDetails,
      onSuccess: () => {
        showIntentDialog.value = false;
        toast.success("Intent added successfully");
      },
    });
  };
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
      name: "bots-id",
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
            <span class="text-xs text-gray-500"
              >This will determine the role of the bot and behavior.</span
            >
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="GOAL">
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
              >The bot will be driving the conversation towards this goal.</span
            >
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
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
      <UiButton
        type="submit"
        class="bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110"
        size="lg"
        >Submit</UiButton
      >
    </UiForm>

    <div class="mt-4 flex items-center justify-between">
      <h3
        class="scroll-m-20 text-xl font-semibold tracking-tight text-indigo-600"
      >
        Intents Management
      </h3>
      <UiButton
        class="bg-yellow-500"
        type="button"
        @click="showIntentDialog = true"
        >Add Intents</UiButton
      >

      <UiDialog v-model:open="showIntentDialog">
        <UiDialogContent class="sm:max-w-[425px]">
          <UiForm class="flex flex-col gap-2" @submit="addIntents">
            <UiDialogHeader>
              <UiDialogTitle class="text-indigo-600">Add Intents</UiDialogTitle>
            </UiDialogHeader>
            <UiFormField v-slot="{ componentField }" name="intent">
              <UiFormItem v-auto-animate="animationProps" class="w-full">
                <UiFormLabel
                  >Actions<UiLabel class="text-lg text-red-500">*</UiLabel>
                </UiFormLabel>
                <UiFormControl>
                  <UiSelect v-bind="componentField">
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select Intent" />
                    </UiSelectTrigger>
                    <UiSelectContent>
                      <UiSelectItem value="location">Location</UiSelectItem>
                      <UiSelectItem value="virtual-tour"
                        >Virtual Tour</UiSelectItem
                      >
                      <UiSelectItem value="schedule-call"
                        >Schedule Call</UiSelectItem
                      >
                      <UiSelectItem value="schedule-site-visit"
                        >Schedule Site Visit</UiSelectItem
                      >
                    </UiSelectContent>
                  </UiSelect>
                  <UiFormField
                    v-if="componentField.modelValue === 'Other'"
                    v-slot="{ componentField }"
                    name="link"
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
                <span class="text-xs text-gray-500">Select your intent.</span>
              </UiFormItem>
            </UiFormField>
            <UiFormField v-slot="{ componentField }" name="link">
              <UiFormItem v-auto-animate="animationProps" class="w-full">
                <UiFormLabel
                  >Add Link <UiLabel class="text-lg text-red-500">*</UiLabel>
                </UiFormLabel>
                <UiFormControl>
                  <UiInput
                    v-bind="componentField"
                    type="text"
                    placeholder="Eg: enter your preferred value"
                  />
                </UiFormControl>
                <span class="text-xs text-gray-500"
                  >The bot will be driving the conversation towards this
                  goal.</span
                >
                <UiFormMessage />
              </UiFormItem>
            </UiFormField>
            <!-- <UiFormField v-if="componentField.modelValue === 'Other'">
            </UiFormField> -->
            <UiDialogFooter>
              <UiButton
                class="bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110"
                type="submit"
              >
                Save changes
              </UiButton>
            </UiDialogFooter>
          </UiForm>
        </UiDialogContent>
      </UiDialog>
    </div>
  </div>
</template>
