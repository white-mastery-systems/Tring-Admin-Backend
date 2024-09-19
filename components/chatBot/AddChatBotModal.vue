<script setup lang="ts">
import { useRoute } from "vue-router";
definePageMeta({
  middleware: "admin-only",
});

const agentModalState = defineModel<{ open: boolean, id: any }>({
  default: {
    open: false,
    id: null,
  },
});
const route = useRoute();
const queryId = ref(route.params.id)
const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'editConfirm'): void;
}>();
// const emit = defineEmits<{ (e: "confirm"): void, (e: "editConfirm"): void }>();
const formSchema = toTypedSchema(
  z.object({
    name: z.string({ required_error: "bot name is required" }).min(2, "Bot Name is required"),
  }),
);

const { handleSubmit, setFieldValue, resetForm } = useForm({
  validationSchema: formSchema
})

watch(() => agentModalState.value.open, async () => {
  if (agentModalState.value.id) {
    const getSingleDetails: any = await $fetch(`/api/bots/${agentModalState.value.id}`)
    console.log(getSingleDetails, "getSingleDetails")
    setFieldValue("name", getSingleDetails.name);
  } else {
    resetForm()
  }
})

const handleAddEditBot = handleSubmit(async (values) => {
  try {
    if (agentModalState.value.id) {
      const bot = await $fetch(`/api/bots/${agentModalState.value.id}`, {
        method: "PUT",
        body: values,
      });
      toast.success("Updated successfully")
    } else {
      await $fetch("/api/bots", {
        method: "POST",
        body: values,
      });
      toast.success("Created successfully")
    }
    if (agentModalState.value.id) {
      emit("editConfirm")
    } else {
      emit('confirm')
    }
  } catch (err: any) {
    toast.error(err.data.data[0].message);
  }
})
</script>

<template>
  <DialogWrapper v-model="agentModalState" :title="(agentModalState.id) ? 'Modify Chat Bot' : 'Add a New Chat Bot'">
    <form @submit="handleAddEditBot">
      <TextField name="name" placeholder="enter your bot name" helperText="Enter your unique identifier for Chat Bot"
        required>
      </TextField>
      <div class="flex justify-end w-full">
        <UiButton color="primary" type="submit">Submit</UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>