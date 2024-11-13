<script setup lang="ts">
  import { useForm } from "vee-validate";
  const emit = defineEmits(["success"]);
  const isLoading = ref(false);
  // const integrationModalState = defineModel<{ open: boolean }>({
  //   default: {
  //     open: false,
  //     id: null,
  //   },
  // });
  const integrationModalState = defineProps<{
    // id?: string;
    title?: string;
    numberModalState: {
      open: boolean;
      id: number | null;
    };
  }>();
  // const props = defineProps<{
  //   numberModalState: {
  //     open: boolean,
  //     id: number | null
  //   }
  // }>();
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

  const shopifySchema = z.object({
    crm: z.literal("shopify"),
    metadata: z.object({
      shop: z.string().min(1, { message: "Shop name is required" }),
    }),
  });
  const zohoCliqSchema = z.object({
    crm: z.literal("zoho-cliq"),
  });
  const reserveGoSchema = z.object({
    crm: z.literal("reserve-go"),
    metadata: z.object({
      apiKey: z.string().min(1, { message: "API key is required" }),
    }),
  });

  const integrationSchema = toTypedSchema(
    z
      .object({
        name: z
          .string({ required_error: "Name is required" })
          .min(1, "Name is required"),
        crm: z
          .enum([
            "sell-do",
            "zoho-crm",
            "zoho-bigin",
            "hubspot",
            "slack",
            "shopify",
            "zoho-cliq",
            "reserve-go",
          ])
          .refine(
            (
              value,
            ): value is
              | "sell-do"
              | "zoho-crm"
              | "zoho-bigin"
              | "hubspot"
              | "slack"
              | "shopify"
              | "zoho-cliq"
              | "reserve-go" => true,
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
          shopifySchema,
          zohoCliqSchema,
          reserveGoSchema,
        ]),
      ),
  );
  const integrationTypes: any = ref([]);
  const route = useRoute();
  watch(
    () => route?.query?.q,
    (queryParam: any) => {
      updateIntegrationTypes(queryParam);
      // if (queryParam === "crm") {
      //   integrationTypes.value = [
      //     { value: "sell-do", label: "Sell Do" },
      //     { value: "zoho-crm", label: "Zoho CRM" },
      //     { value: "zoho-bigin", label: "Zoho Bigin" },
      //     { value: "hubspot", label: "Hubspot" },
      //   ];
      // } else if (queryParam === "communication") {
      //   integrationTypes.value = [
      //     { value: "slack", label: "Slack" },
      //     { value: "zoho-cliq", label: "Zoho Cliq" },
      //   ];
      // } else if (queryParam === "ecommerce") {
      //   integrationTypes.value = [{ value: "shopify", label: "Shopify" }];
      // }
    },
    { deep: true },
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
  const metadata = ref<any>({});
  watch(
    () => integrationModalState.numberModalState,
    async (value) => {
      resetForm();
      if (!value.id) return;
      const integrationDetails = await $fetch<{
        name: string;
        crm:
          | "sell-do"
          | "zoho-crm"
          | "zoho-bigin"
          | "hubspot"
          | "slack"
          | "shopify"
          | "zoho-cliq"
          | "reserve-go";
        metadata?: { apiKey: string };
      }>(`/api/org/integrations/${integrationModalState.numberModalState.id}`); // integrationModalState
      setFieldValue("name", integrationDetails?.name);
      setFieldValue("crm", integrationDetails?.crm);
      metadata.value = integrationDetails?.metadata || {};
      if (integrationDetails?.crm === "sell-do") {
        setFieldValue("metadata", {
          apiKey: integrationDetails?.metadata?.apiKey,
        });
      } else if (integrationDetails?.crm === "reserve-go") {
        setFieldValue("metadata", {
          apiKey: integrationDetails?.metadata?.apiKey,
        });
      } else if (integrationDetails?.crm === "zoho-crm") {
      } else if (integrationDetails?.crm === "zoho-bigin") {
      } else if (integrationDetails?.crm === "hubspot") {
        setFieldValue("metadata", {
          ...integrationDetails?.metadata,
        });
      } else if (integrationDetails?.crm === "shopify") {
        setFieldValue("metadata", {
          ...integrationDetails?.metadata,
        });
      }
    },
    { deep: true },
  );
  onMounted(() => {
    updateIntegrationTypes(route.query?.q);
  });

  const handleConnect = handleSubmit(async (values: any) => {
    isLoading.value = true;

    let url = `${window.location.origin}/settings/integration/${values.crm}`;
    // let url = "https://app.tringlabs.ai/settings";
    let scope = "";
    if (values.crm === "zoho-crm") {
      scope = "ZohoCRM.settings.ALL,ZohoCRM.modules.ALL,ZohoCRM.org.READ";
    } else if (values.crm === "zoho-bigin") {
      scope = "ZohoBigin.settings.ALL,ZohoBigin.modules.ALL,ZohoBigin.org.READ";
    } else if (values.crm === "zoho-cliq") {
      scope =
        "ZohoCliq.Channels.CREATE,ZohoCliq.Channels.READ,ZohoCliq.Channels.UPDATE,ZohoCliq.Webhooks.CREATE";
      // scope = "https://accounts.zoho.in/oauth/v2/auth?scope=&client_id=1000.K0KXY300LK9C1SEEXNQG4P5I37YG4I&response_type=code&redirect_uri=https://tring-admin.pripod.com/settings/integration/zoho-cliq&access_type=offline";
    }

    const payload: any = {
      ...values,
      scope,
      url,
      type: route.query.q ?? "crm",
      ...(values.crm !== "sell-do" && values.crm !== "reserve-go"
        ? {
            metadata: { status: "Pending" },
          }
        : {
            metadata: {
              ...metadata.value,
              ...(values?.metadata || {}),
              status: "Verified",
            },
          }),
    };

    if (integrationModalState.numberModalState?.id) {
      await updateIntegrationById({
        id: integrationModalState.numberModalState.id,
        integrationDetails: {
          ...values,
          metadata: { ...metadata.value, ...(values?.metadata || {}) },
          scope,
          url,
          type: route.query.q ?? "crm",
        },
        /**
         * This function is called after the integration is updated successfully.
         * It emits a success event back to the parent component.
         */
        onSuccess: () => {
          emit("success");
        },
      });
      isLoading.value = false;

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
          } else if (values.crm === "zoho-cliq") {
            window.open(
              `https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.K0KXY300LK9C1SEEXNQG4P5I37YG4I&scope=${scope}&redirect_uri=${url}&prompt=consent&access_type=offline`,
              "_blank",
            );
          } else if (values.crm === "hubspot") {
            const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=ae187200-936d-44f3-8e59-5bab2f50aa3c&redirect_uri=${url}&scope=crm.objects.contacts.write%20oauth%20crm.objects.deals.read%20crm.objects.deals.write%20crm.objects.contacts.read&optional_scope=crm.schemas.deals.write%20crm.objects.owners.read`;
            window.open(authUrl, "_blank");
          } else if (values.crm === "slack") {
            window.open(
              // `https://slack.com/oauth/v2/authorize?scope=chat%3Awrite&user_scope=chat%3Awrite&redirect_uri=https%3A%2F%2F6t53p9kf-3000.inc1.devtunnels.ms%2Fsettings%2Fintegration%2Fslack&client_id=7763394615058.7867610213248`
              `https://slack.com/oauth/v2/authorize?scope=chat:write,channels:read,channels:join&redirect_uri=${url}&client_id=7763394615058.7867610213248`,
              // "https://slack.com/oauth/v2/authorize?scope=incoming-webhook&client_id=7856740970225.7841202988373",
              "_blank",
            );
          } else if (values.crm === "shopify") {
            window.open(
              `https://${values.metadata.shop}.myshopify.com/admin/oauth/authorize?client_id=e766d107bd1a2d83dfd696f9f16282b1&scope=read_products,unauthenticated_read_checkouts,unauthenticated_write_checkouts,read_shipping,read_inventory,write_draft_orders,read_draft_orders&redirect_uri=${url}`,
              "_blank",
            );
          }
          //b2c6269af5da3c2f7fb3fb929de90af7
          emit("success");
          isLoading.value = false;
        },
      });
      isLoading.value = false;
    }
  });
  function findIntegrationTypeLabel() {
    if (route?.query?.q === "crm") {
      return "Select CRM";
    } else if (route?.query?.q === "communication") {
      return "Select App";
    } else if (route?.query?.q === "ecommerce") {
      return "Select Platform";
    } else {
      return "Select CRM";
    }
  }

  const updateIntegrationTypes = (queryParam: any) => {
    if (queryParam === "crm") {
      integrationTypes.value = [
        { value: "sell-do", label: "Sell Do" },
        { value: "zoho-crm", label: "Zoho CRM" },
        { value: "zoho-bigin", label: "Zoho Bigin" },
        { value: "hubspot", label: "Hubspot" },
        { value: "reserve-go", label: "Reserve Go" },
      ];
    } else if (queryParam === "communication") {
      integrationTypes.value = [
        { value: "slack", label: "Slack" },
        { value: "zoho-cliq", label: "Zoho Cliq" },
      ];
    } else if (queryParam === "ecommerce") {
      integrationTypes.value = [{ value: "shopify", label: "Shopify" }];
    } else {
      integrationTypes.value = [
        { value: "sell-do", label: "Sell Do" },
        { value: "zoho-crm", label: "Zoho CRM" },
        { value: "zoho-bigin", label: "Zoho Bigin" },
        { value: "hubspot", label: "Hubspot" },
        { value: "reserve-go", label: "Reserve Go" },
      ];
    }
  };
</script>

<template>
  <DialogWrapper
    v-model="integrationModalState.numberModalState"
    :title="
      integrationModalState.numberModalState?.id
        ? `Edit ${integrationModalState?.title ?? 'CRM'} Channel`
        : `Add ${integrationModalState?.title ?? 'CRM'} Channel`
    "
  >
    <form @submit="handleConnect" class="space-y-2">
      <!-- {{ values }} || sdfdsf -->
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
          :label="findIntegrationTypeLabel()"
          :placeholder="findIntegrationTypeLabel()"
          helperText="Select your channel"
          :options="integrationTypes"
          required
        />
        <div class="relative">
          <TextField
            v-if="values.crm === 'shopify'"
            name="metadata.shop"
            label="Shop Name"
            helperText="Enter your shopname"
            placeHolder="Eg: vaanium"
            required
          >
            <template #endSlot>
              <div
                class="h-full w-full cursor-pointer rounded-md bg-gray-200 p-2"
                type="button"
              >
                .myshopify.com
              </div>
            </template>
          </TextField>
        </div>

        <TextField
          v-if="values.crm === 'sell-do' || values.crm === 'reserve-go'"
          name="metadata.apiKey"
          label="Api key"
          helperText="Enter your API key here"
          placeHolder="Eg: api-key-here"
          required
        />
        <!-- {{values.metadata}} -->

        <div class="flex w-full justify-end">
          <UiButton
            type="submit"
            class="mt-2"
            color="primary"
            :loading="isLoading"
          >
            {{
              values.crm === "zoho-crm"
                ? integrationModalState.numberModalState?.id
                  ? "Update changes"
                  : "Connect Zoho CRM"
                : values.crm === "zoho-bigin"
                  ? integrationModalState.numberModalState?.id
                    ? "Update changes"
                    : "Connect Zoho Bigin"
                  : integrationModalState.numberModalState?.id
                    ? "Update changes"
                    : "Save changes"
            }}
          </UiButton>
        </div>
      </div>
    </form>
  </DialogWrapper>
</template>
