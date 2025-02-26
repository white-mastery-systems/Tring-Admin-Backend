<template>
  <!-- <DialogWrapper v-model="agentModalState" :title="agentModalState.id ? 'Modify Chat Bot' : 'Add a New Chat Bot'"> -->
  <form @submit.prevent="handleAddEditBot" class="flex gap-2">
    <TextField label="Bot Name" name="name" placeholder="enter your bot name" required>
    </TextField>
    <SelectField name="type" label="Bot Type " placeholder="Select Type" :options="botTypes" :required="true"  />
    <SelectField v-if="values.type === 'ecommerce'" name="integrationId" :multiple="false" label="Select Integration"
      placeholder="Select Integration" :options="integrationsData.map((integration) => ({
          value: integration.id,
          label: integration.name,
        }))
          " />

    <!-- <div class="mt-2 flex w-full justify-end">
        <UiButton type="submit" color="primary" :loading="isLoading">
          Submit
        </UiButton>
      </div> -->
  </form>
  <!-- </DialogWrapper> -->
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { botTypes } from '~/composables/botManagement/chatBot/useBotType'
definePageMeta({
  middleware: "admin-only",
});
// const agentModalState = defineModel<{ open: boolean; id: any }>({
//   default: {
//     open: false,
//     id: null,
//   },
// });
const route = useRoute();
const queryId = ref(route.params?.id);
// const emit = defineEmits<{
//   (e: "confirm"): void;
//   (e: "editConfirm"): void;
// }>();
const isLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    name: z
      .string({ required_error: "Bot name is required" })
      .min(2, "Bot Name is required"),
    type: z.string({ required_error: "Bot type is required" }),
    integrationId: z.string().optional(), // Always optional
  }).superRefine((data, ctx) => {
    if (data.type === "ecommerce" && !data.integrationId) {
      ctx.addIssue({
        path: ["integrationId"],
        message: "Integration ID is required for E-Commerce type.",
      })
    }
  })
);

const { handleSubmit, setFieldValue, resetForm, values, errors } = useForm({
  validationSchema: formSchema,
});

// watch(
//   () => agentModalState.value.open,
//   async () => {
//     resetForm();
//     if (agentModalState.value.id) {
//       const getSingleDetails: any = await $fetch(
//         `/api/bots/${agentModalState.value.id}`,
//       );
//       setFieldValue("name", getSingleDetails.name);
//       setFieldValue("type", getSingleDetails.type);
//       if (getSingleDetails?.integrationId) {
//         setFieldValue("integrationId", getSingleDetails?.integrationId);
//       }
//     }
//   },
// );

const handleAddEditBot = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    // if (agentModalState.value.id) {
    const bot = await $fetch(`/api/bots/${queryId.value}`, {
        method: "PUT",
        body: values,
      });
      toast.success("Updated successfully");
    // }
    // if (agentModalState.value.id) {
    //   emit("editConfirm");
    // } else {
    //   emit("confirm");
    // }
  } catch (err: any) {
    isLoading.value = false;
    toast.error(err.data.data[0].message);
  }
  isLoading.value = false;
});
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