<script setup lang="ts">
  import { useForm } from "vee-validate";
  const emit = defineEmits(["success"]);
  const integrationModalState = defineModel<{ open: boolean }>({
    default: {
      open: false,
    },
  });
  const integrationModalProps = defineProps<{
    id?: string;
  }>();

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

  const { setFieldValue, handleSubmit, errors, defineField } = useForm({
    validationSchema: integrationSchema,
    initialValues: {
      name: "",
    },
  });
  console.log({ errors: errors?.value });
  const [name, nameAttrs] = defineField("name");
  const handleConnect = handleSubmit((values) => {
    console.log({ values });
    setFieldValue("name", "john");
  });
  // setFieldvalue("name", "john");

  watch(
    () => integrationModalState.value.open,
    async (isOpen) => {
      const integrationDetails = await $fetch(
        `/api/org/integrations/${integrationModalProps.id}`,
      );
      console.log({ integrationDetails });
      setFieldValue("name", "johnddd");
    },
  );
  // async function handleConnect(values: any) {
  //   let url = `${window.location.origin}/settings/integration/${values.crm}`;
  //   // let url = "https://app.tringlabs.ai/settings";
  //   let scope = "";
  //   if (values.crm === "zoho-crm") {
  //     scope = "ZohoCRM.settings.ALL,ZohoCRM.modules.ALL,ZohoCRM.org.READ";
  //   } else if (values.crm === "zoho-bigin") {
  //     scope = "ZohoBigin.settings.ALL,ZohoBigin.modules.ALL,ZohoBigin.org.READ";
  //   }
  //   const payload: any = {
  //     ...values,
  //     scope,
  //     url,
  //     ...(values.crm !== "sell-do" && { metaData: { status: "pending" } }),
  //   };

  //   await createIntegration({
  //     integrationDetails: payload,
  //     onSuccess: () => {
  //       if (values.crm !== "sell-do")
  //         window.open(
  //           `https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&scope=${scope}&redirect_uri=${url}&prompt=consent&access_type=offline`,
  //           "_blank",
  //         );
  //       emit("success");
  //     },
  //   });
  // }
</script>

<template>
  <DialogWrapper
    v-model="integrationModalState"
    :title="
      integrationModalProps?.id ? 'Edit Integration' : 'Add New Integration'
    "
  >
    <UiForm
      v-slot="{ values }"
      @submit="handleConnect"
      :keep-values="true"
      :validate-on-mount="false"
      class="space-y-2"
    >
      <UiFormField v-model="name" v-bind="nameAttrs" name="name">
        <UiFormItem class="w-full">
          <UiFormLabel
            >Name <UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiInput
              type="text"
              v-model="name"
              v-bind="nameAttrs"
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
  </DialogWrapper>
</template>
