<script setup lang="ts">
  import { DateFormatter } from "@internationalized/date";
  import { roleMangementSchema } from "~/validationSchema/settings/roleManagementValidation.";

  definePageMeta({
    middleware: "admin-only",
  });
  const emit = defineEmits<{ (e: "confirm"): void }>();
  const userModalState = defineModel<{ open: boolean; id: any }>({
    default: {
      open: false,
      id: null,
    },
  });



  const campaignListWithLabels = computed(() => {
    if (userModalState) {
      return userDataList.value?.map((item: any) => {
        return {
          value: item.id,
          label: item.id ? item.name : "", // Change label based on id value
        };
      });
    }
  });

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  });
  const placeholder = ref();
  const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;

  const {
    errors,
    setErrors,
    setFieldValue,
    handleSubmit,
    defineField,
    values,
    resetForm,
  } = useForm({
    validationSchema: roleMangementSchema,
  });


  watch(
    () => userModalState.value.open,
    async (newState) => {
      resetForm();
      if (userModalState.value.id) {
        const getSingleDetails: any = await $fetch(
          `/api/user-role/${userModalState.value.id}`,
        );
          Object.entries(getSingleDetails).forEach(([key, value]: any) => {
            if (values.hasOwnProperty(key)) {
              setFieldValue(key, value);
            }
          });

      }
    },
  );

  const handleConnect = handleSubmit(async (values: any) => {
    try {
      if (userModalState.value.id) {
        await $fetch(`/api/user-role/${userModalState.value.id}`, {
          method: "PUT",
          body: values,
        });
        toast.success("Updated successfully");
      } else {
        await $fetch("/api/user-role", { method: "POST", body: {...values,permissions:[{
          emailConfig:true
        }]} });
        toast.success("Created successfully");
      }
      emit("confirm");
    } catch (error: any) {
      toast.error(error.data);
    }
  });


</script>
<template>
  <DialogWrapper
    v-model="userModalState"
    :title="userModalState.id ? 'Modify Role' : 'Add Role'"
  >
      <form class="space-y-2" @submit="handleConnect">
        <div class="grid gap-4">
          <TextField
            type="name"
            name="name"
            label="Name"
            placeholder="Enter Your Role"
            :required="true"
          />

          <div class="flex w-full justify-end">
            <UiButton type="submit" class="mt-2" color="primary">
              Submit
            </UiButton>
          </div>
        </div>
      </form>
  </DialogWrapper>
</template>
