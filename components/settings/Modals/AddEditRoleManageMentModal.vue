<script setup lang="ts">
  import { DateFormatter } from "@internationalized/date";
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
  import { roleMangementSchema } from "~/validationSchema/settings/roleManagementValidation.";

  definePageMeta({
    middleware: "admin-only",
  });
  const emit = defineEmits<{ (e: "confirm"): void }>();
  const roleModalState = defineModel<{ open: boolean; id: any }>({
    default: {
      open: false,
      id: null,
    },
  });

  const campaignListWithLabels = computed(() => {
    if (roleModalState) {
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
    () => roleModalState.value.open,
    async (newState) => {
      resetForm();
      if (roleModalState.value.id) {
        const getSingleDetails: any = await $fetch(
          `/api/user-role/${roleModalState.value.id}`,
        );
        setFieldValue('permissions',getSingleDetails.permissions)
        Object.entries(getSingleDetails).forEach(([key, value]: any) => {
          if (values.hasOwnProperty(key)) {
            setFieldValue(key, value);
          }
        });

        console.log({ getSingleDetails });
        
      }
    },
  );

  const handleConnect = handleSubmit(async (value: any) => {
    try {
      console.log(values);
      
      if (roleModalState.value.id) {
        await $fetch(`/api/user-role/${roleModalState.value.id}`, {
          method: "PUT",
          body: values,
        });
        toast.success("Updated successfully");
      } else {
        await $fetch("/api/user-role", {
          method: "POST",
          body: {
            ...values,
          },
        });
        toast.success("Created successfully");
      }
      emit("confirm");
    } catch (error: any) {
      toast.error(error.statusMessage);
    }
  });
</script>
<template>
  <DialogWrapper
    v-model="roleModalState"
    :title="roleModalState.id ? 'Modify Role' : 'Add Role'"
  >
    <form class="space-y-2" @submit="handleConnect">
      <div class="grid gap-4">
        <TextField
          type="text"
          name="name"
          label="Name"
          placeholder="Enter Your Role"
          :required="true"  
        />

        <div class="flex items-center gap-1">
          <UiCheckbox id="terms" :checked="values?.permissions?.sendEmail" @update:checked="(value) =>{
            const permissions = !values?.permissions.sendEmail
            // console.log(permissions)
            setFieldValue('permissions',{...values?.permissions,sendEmail:permissions})
            console.log({values});
            
          }"
            :style="{ background: (values?.permissions?.sendEmail) ? '#424bd1' : 'white', 'border-color': '#80808078' }" />
          <label for="terms"
            class="flex items-end text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Email Config
          </label>
        </div>

        <div class="flex w-full justify-end">
          <UiButton type="submit" class="mt-2" color="primary">
            Submit
          </UiButton>
        </div>
      </div>
    </form>
  </DialogWrapper>
</template>
