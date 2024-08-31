<script setup lang="ts">
  const emit = defineEmits(["success"]);
  const integrationModalState = defineModel<{ open: boolean }>({
    default: {
      open: false,
    },
  });
  watch(integrationModalState, (newIntegrationState) => {
    console.log({ newIntegrationState });
  });
  console.log(window.location.origin, "LOCATION");
  async function handleConnect(values: any) {
    let url = `${window.location.origin}/settings/integration/${values.crm}`;
    // let url = "https://app.tringlabs.ai/settings";
    let scope = "";
    if (values.crm === "zoho-crm") {
      scope = "ZohoCRM.settings.ALL,ZohoCRM.modules.ALL";
    } else if (values.crm === "zoho-bigin") {
      scope = "ZohoBigin.settings.ALL,ZohoBigin.modules.ALL";
    }
    const payload: any = {
      ...values,
      scope,
      url,
      ...(values.crm !== "sell-do" && { metaData: { status: "pending" } }),
    };

    await createIntegration({
      integrationDetails: payload,
      onSuccess: () => {
        if (values.crm !== "sell-do")
          window.open(
            `https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&scope=${scope}&redirect_uri=${url}&prompt=consent&access_type=offline`,
            "_blank",
          );
        emit("success");
      },
    });
  }

  
  const sellDoSchema = z.object({
    crm: z.literal("sell-do"),
    metaData: z.object({
      apiKey: z.string().min(1, { message: "API key is required" }),
    }),
  });

  const zohoCRMSchema = z.object({
    crm: z.literal("zoho-crm"),
  });

  const zohoBiginSchema = z.object({
    crm: z.literal("zoho-bigin"),
  });

  const integrationSchema = toTypedSchema(
    z
      .object({
        name: z.string().min(1, { message: "Name is required" }),
        crm: z
          .enum(["sell-do", "zoho-crm", "zoho-bigin"])
          .refine(
            (value): value is "sell-do" | "zoho-crm" | "zoho-bigin" => true,
            {
              message: "CRM type is required",
            },
          ),
      })
      .and(
        z.discriminatedUnion("crm", [
          sellDoSchema,
          zohoCRMSchema,
          zohoBiginSchema,
        ]),
      ),
  );
</script>

<template>
  <UiDialog v-model:open="integrationModalState.open">
    <UiDialogContent
      class="max-w-[330px] rounded-lg sm:max-w-[300px] md:max-w-[400px] lg:max-w-[400px] xl:max-w-[400px]"
    >
      <UiDialogHeader>
        <UiDialogTitle>Add New Integration</UiDialogTitle>
      </UiDialogHeader>
      <UiForm
        v-slot="{ values }"
        :validation-schema="integrationSchema"
        @submit="handleConnect"
        :keep-values="true"
        :validate-on-mount="false"
        class="space-y-2"
      >
        <UiFormField v-slot="{ componentField }" name="name">
          <UiFormItem class="w-full">
            <UiFormLabel
              >Name <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                type="text"
                v-bind="componentField"
                placeholder="Eg: CRM-your company,CRM-your company"
              />
            </UiFormControl>
            <UiFormMessage />
            <span class="text-xs text-gray-500"
              >Enter a unique identification for CRM integration</span
            >
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="crm">
          <UiFormItem class="w-full">
            <UiFormLabel>
              CRM<UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField">
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select CRM" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem value="sell-do">Sell Do</UiSelectItem>
                  <UiSelectItem value="zoho-crm">Zoho CRM</UiSelectItem>
                  <UiSelectItem value="zoho-bigin">Zoho Bigin</UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </UiFormControl>
            <UiFormMessage />
            <span class="text-xs text-gray-500">Select your CRM provider.</span>
          </UiFormItem>
        </UiFormField>

        <UiFormField
          v-if="values.crm === 'sell-do'"
          v-slot="{ componentField }"
          name="metaData.apiKey"
        >
          <UiFormItem class="w-full">
            <UiFormLabel
              >API key <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                type="text"
                v-bind="componentField"
                placeholder="Eg: api-key-here"
              />
            </UiFormControl>
            <span class="text-xs text-gray-500">Enter your API key here</span>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiButton type="submit" class="mt-2" color="primary">
          {{
            values.crm === "zoho-crm"
              ? "Connect Zoho CRM"
              : values.crm === "zoho-bigin"
                ? "Connect Zoho Bigin"
                : "Save changes"
          }}
        </UiButton>
      </UiForm>
    </UiDialogContent>
  </UiDialog>
</template>
<!-- https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&scope=ZohoBigin.settings.ALL,ZohoBigin.modules.ALL&redirect_uri=https://tring-admin.pripod.com/settings/integration/zoho-bigin&prompt=consent&access_type=offline -->
