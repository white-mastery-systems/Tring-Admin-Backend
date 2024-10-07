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
    metadata: z.object({
      apiKey: z.string().min(1, { message: "API key is required" }),
    }),
  });

  const zohoCRMSchema = z.object({
    crm: z.literal("zoho-crm"),
  });

  const zohoBiginSchema = z.object({
    crm: z.literal("zoho-bigin"),
  });
  const hubSpotSchema = z.object({
    crm: z.literal("hubspot"),
  });
  const slackSchema = z.object({
    crm: z.literal("slack"),
  });

  const integrationSchema = toTypedSchema(
    z
      .object({
        name: z
          .string({ required_error: "Name is required" })
          .min(1, "Name is required"),
        crm: z
          .enum(["sell-do", "zoho-crm", "zoho-bigin", "hubspot", "slack"])
          .refine(
            (
              value,
            ): value is
              | "sell-do"
              | "zoho-crm"
              | "zoho-bigin"
              | "hubspot"
              | "slack" => true,
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
          hubSpotSchema,
          slackSchema,
        ]),
      ),
  );

  const {
    setFieldValue,
    handleSubmit,
    errors,
    values,
    defineField,
    resetForm,
  } = useForm({
    validationSchema: integrationSchema,
    initialValues: {
      // name: "",
    },
  });

  watch(
    () => integrationModalState.value,
    async (value) => {
      resetForm();
      if (!value.id) return;
      const integrationDetails = await $fetch<{
        name: string;
        crm: "sell-do" | "zoho-crm" | "zoho-bigin";
        metadata?: { apiKey: string };
      }>(`/api/org/integrations/${integrationModalProps.id}`);
      setFieldValue("name", integrationDetails?.name);
      setFieldValue("crm", integrationDetails?.crm);
      if (integrationDetails?.crm === "sell-do") {
        setFieldValue("metadata", {
          apiKey: integrationDetails?.metadata?.apiKey,
        });
      } else if (integrationDetails?.crm === "zoho-crm") {
      } else if (integrationDetails?.crm === "zoho-bigin") {
      }
    },
    { deep: true },
  );
  const handleConnect = handleSubmit(async (values: any) => {
    console.log({ values });
    let url = `${window.location.origin}/settings/integration/${values.crm}`;
    // let url = "https://app.tringlabs.ai/settings";
    let scope = "";
    if (values.crm === "zoho-crm") {
      scope = "ZohoCRM.settings.ALL,ZohoCRM.modules.ALL,ZohoCRM.org.READ";
    } else if (values.crm === "zoho-bigin") {
      scope = "ZohoBigin.settings.ALL,ZohoBigin.modules.ALL,ZohoBigin.org.READ";
    }
    const payload: any = {
      ...values,
      scope,
      url,
      ...(values.crm !== "sell-do" && { metadata: { status: "pending" } }),
    };

    if (integrationModalProps?.id) {
      await updateIntegrationById({
        id: integrationModalProps.id,
        integrationDetails: {
          ...values,
          scope,
          url,
          // ...(values.crm !== "sell-do" && { metadata: { status: "pending" } }),
        },
        onSuccess: () => {
          emit("success");
        },
      });
      // emit("success");
    } else {
      await createIntegration({
        integrationDetails: payload,
        onSuccess: () => {
          if (values.crm === "zoho-bigin" || values.crm === "zoho-crm") {
            window.open(
              `https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&scope=${scope}&redirect_uri=${url}&prompt=consent&access_type=offline`,
              "_blank",
            );
          } else if (values.crm === "hubspot") {
            const authUrl =
              "https://app.hubspot.com/oauth/authorize?client_id=2d35af31-b5cc-4408-8eb6-377fe23592b5&redirect_uri=https://6t53p9kf-3000.inc1.devtunnels.ms/settings/integration/hubspot&scope=oauth";
            // const authUrl =
            //   "https://app.hubspot.com/oauth/authorize" +
            //   `?client_id=${encodeURIComponent(CLIENT_ID)}` +
            //   `&scope=${encodeURIComponent(SCOPES)}` +
            //   `&redirect_uri=${encodeURIComponent('https://app.hubspot.com/oauth/authorize?client_id=2d35af31-b5cc-4408-8eb6-377fe23592b5&redirect_uri=https://6t53p9kf-3000.inc1.devtunnels.ms/integrations/hubspot&scope=oauth')}`;
            console.log({ authUrl });
            window.open(authUrl, "_blank");
          }
          emit("success");
        },
      });
    }
  });
</script>

<template>
  <DialogWrapper
    v-model="integrationModalState"
    :title="
      integrationModalProps?.id ? 'Edit Integration' : 'Add New Integration'
    "
  >
    <form @submit="handleConnect" class="space-y-2">
      <div class="flex flex-col gap-2">
        <TextField
          name="name"
          label="Name"
          placeholder="enter integration name"
          helperText="Enter a unique identification for CRM integration"
          placeHolder="Eg: CRM-your company,CRM-your company"
          required
        />
        <SelectField
          name="crm"
          label="CRM"
          placeholder="Select CRM"
          helperText="Select your CRM provider."
          :options="[
            { value: 'sell-do', label: 'Sell Do' },
            { value: 'zoho-crm', label: 'Zoho CRM' },
            { value: 'zoho-bigin', label: 'Zoho Bigin' },
            { value: 'hubspot', label: 'Hubspot' },
            { value: 'slack', label: 'Slack' },
          ]"
          required
        />

        <TextField
          v-if="values.crm === 'sell-do'"
          name="metadata.apiKey"
          label="Api key"
          helperText="Enter your API key here"
          placeHolder="Eg: api-key-here"
          required
        />
        <div class="flex w-full justify-end">
          <UiButton type="submit" class="mt-2" color="primary">
            {{
              values.crm === "zoho-crm"
                ? integrationModalProps?.id
                  ? "Update changes"
                  : "Connect Zoho CRM"
                : values.crm === "zoho-bigin"
                  ? integrationModalProps?.id
                    ? "Update changes"
                    : "Connect Zoho Bigin"
                  : integrationModalProps?.id
                    ? "Update changes"
                    : "Save changes"
            }}
          </UiButton>
        </div>
      </div>
    </form>
  </DialogWrapper>
</template>
