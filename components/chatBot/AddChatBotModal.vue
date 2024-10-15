<script setup lang="ts">
  import { useRoute } from "vue-router";
  definePageMeta({
    middleware: "admin-only",
  });

  const agentModalState = defineModel<{ open: boolean; id: any }>({
    default: {
      open: false,
      id: null,
    },
  });
  const route = useRoute();
  const queryId = ref(route.params.id);
  const emit = defineEmits<{
    (e: "confirm"): void;
    (e: "editConfirm"): void;
  }>();
  const isLoading = ref(false);
  // const emit = defineEmits<{ (e: "confirm"): void, (e: "editConfirm"): void }>();
  const formSchema = toTypedSchema(
    z
      .object({
        name: z
          .string({ required_error: "bot name is required" })
          .min(2, "Bot Name is required"),
        type: z.string({ required_error: "bot type is required" }),
        integrationId: z.string().optional(),
      })
      .refine(
        (data) => {
          if (data.type === "ecommerce" && !data?.integrationId) {
            return false;
          }
          return true;
        },
        {
          message: "Other role must be provided",
          path: ["otherRole"],
        },
      ),
  );

  const { handleSubmit, setFieldValue, resetForm, values } = useForm({
    validationSchema: formSchema,
  });

  watch(
    () => agentModalState.value.open,
    async () => {
      if (agentModalState.value.id) {
        const getSingleDetails: any = await $fetch(
          `/api/bots/${agentModalState.value.id}`,
        );
        console.log(getSingleDetails, "getSingleDetails");
        setFieldValue("name", getSingleDetails.name);
        setFieldValue("type", getSingleDetails.type);
        setFieldValue("integrationId", getSingleDetails?.integrationId);
      } else {
        resetForm();
      }
    },
  );

  const handleAddEditBot = handleSubmit(async (values) => {
    isLoading.value = true;
    try {
      if (agentModalState.value.id) {
        const bot = await $fetch(`/api/bots/${agentModalState.value.id}`, {
          method: "PUT",
          body: values,
        });
        toast.success("Updated successfully");
      } else {
        await $fetch("/api/bots", {
          method: "POST",
          body: values,
        });
        toast.success("Created successfully");
      }
      if (agentModalState.value.id) {
        emit("editConfirm");
      } else {
        emit("confirm");
      }
    } catch (err: any) {
      isLoading.value = false;
      toast.error(err.data.data[0].message);
    }
    isLoading.value = false;
  });
  const botTypes = [
    { label: "E-commerce", value: "ecommerce" },
    { label: "Real Estate", value: "real-estate" },
  ];
  const {
    status: integrationLoadingStatus,
    data: integrationsData,
    refresh: integrationRefresh,
  } = await useLazyFetch("/api/org/integrations", {
    server: false,
    query: {
      q: "ecommerce",
    },
    default: () => [],
  });
</script>

<template>
  <DialogWrapper
    v-model="agentModalState"
    :title="agentModalState.id ? 'Modify Chat Bot' : 'Add a New Chat Bot'"
  >
    <form @submit="handleAddEditBot">
      <TextField
        label="Bot Name"
        name="name"
        placeholder="enter your bot name"
        helperText="Enter your unique identifier for Chat Bot"
        required
      >
      </TextField>
      <SelectField
        name="type"
        label="Bot Type "
        placeholder="Select Type"
        :options="botTypes"
        :required="true"
      />
      <SelectField
        v-if="values.type === 'ecommerce'"
        name="integrationId"
        :multiple="false"
        :required="true"
        label="Select Integration"
        placeholder="Select Integration"
        :options="
          integrationsData.map((integration) => ({
            value: integration.id,
            label: integration.name,
          }))
        "
      />

      <div class="mt-2 flex w-full justify-end">
        <UiButton type="submit" color="primary" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>
