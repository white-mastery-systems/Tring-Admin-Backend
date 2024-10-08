<script setup lang="ts">
  import { DateFormatter } from "@internationalized/date";
  import { userMangementSchema } from "~/validationSchema/settings/userMangementValidation";

  definePageMeta({
    middleware: "admin-only",
  });
  const emit = defineEmits<{ (e: "confirm"): void }>();
  const userModalState = defineModel<{ open: boolean; id: any,roles:Array<any> }>({
    default: {
      open: false,
      id: null,
    },
  });
  const isLoading = ref(false)
  // const schema =  ref(EdituserMangementSchema)
    watch(
    () => userModalState.value.open,
    async (newState) => {
      if (newState) {
      resetForm()
      console.log(userModalState.value.id);
      
      if(userModalState.value.id) {
          const userDetail = await $fetch(
            `/api/user/${userModalState.value.id}`,
          );
          Object.entries(userDetail).forEach(([key, value]: any) => {
            if (key === "username") key = "name";
            if (values.hasOwnProperty(key)) {
              setFieldValue(key, value);
            }
          });
      }

      }
    },
  );
  const {
    errors,
    setErrors,
    setFieldValue,
    handleSubmit,
    defineField,
    values,
    resetForm,
  } = useForm({
    validationSchema: userMangementSchema,
  });

  const templates = ref<any>([]);
  const phoneNumbers = ref<any>([]);



  const handleConnect = handleSubmit(async (values: any) => {
    isLoading.value = true
    try {
      if (userModalState.value.id) {
        await $fetch(`/api/user/${userModalState.value.id}`, {
          method: "PUT",
          body: values,
        });
        toast.success("Updated successfully");
      } else {
        await $fetch("/api/user", { method: "POST", body: values });
        toast.success("Created successfully");
      }
      emit("confirm");
    } catch (error: any) {
      toast.error(error.statusMessage);
      isLoading.value = false
    }
    isLoading.value = false
  });
  const passwordVisible = ref(false);
  const confirmPasswordVisible = ref(false);

  const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
  };
  const toggleConfirmPasswordVisibility = () => {
    confirmPasswordVisible.value = !confirmPasswordVisible.value;
  };
</script>
<template>
  <DialogWrapper v-model="userModalState" :title="userModalState.id ? 'Modify User' : 'Add User'">
    <form class="space-y-2" @submit="handleConnect">
      <!-- copy paste the class  below-->
      <!-- class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium" -->

      <div class="grid gap-4">
        <TextField type="text" name="name" label="Name" placeholder="Enter Your Name" required />
        <TextField type="email" name="email" label="E-mail" placeholder="Enter Your Email" required />

        <SelectField label="Role" name="roleId" :multiple="false" :required="true" placeholder="Select your role"
          :options="userModalState.roles?.map((role: any) => ({ label: role.name, value: role.id }))" />
        <div class="flex gap-2 ">
          <CountryCodeField class="mt-1.5 w-[100px] " name="countryCode" label="Country Code"
            helperText="Enter your country code" required />

          <TextField :disableCharacters="true" name="mobile" label="Mobile number" helperText="" required
            placeholder="Enter your mobile number" />
        </div>
        <div class="relative">
          <TextField :type="passwordVisible ? 'text' : 'password'" name="password" label="Password"
            placeholder="Password" required>
            <template #endIcon>
              <div class="w-[30px] cursor-pointer mt-1.5" @click="togglePasswordVisibility" type="button">
                <OpenEye v-if="passwordVisible" />
                <CloseEyeIcon v-else />
              </div>
            </template>
          </TextField>
        </div>
        <div class="relative">
          <TextField :type="confirmPasswordVisible ? 'text' : 'password'" name="confirmPassword"
            label="Confirm Password" placeholder="Confirm Your Password" required>
            <template #endIcon>
              <div class="w-[30px] cursor-pointer mt-1.5" @click="toggleConfirmPasswordVisibility" type="button">
                <OpenEye v-if="confirmPasswordVisible" />
                <CloseEyeIcon v-else />
              </div>
            </template>
          </TextField>
        </div>
      </div>
      <div class="flex w-full justify-end">
        <UiButton type="submit" class="mt-2" color="primary" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>
