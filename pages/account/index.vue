<template>
  <Page title="My Account" :disable-back-button="true">
    <template #actionButtons>
      <div>
        <UiButton @click="confirmModel"
          class="items-start justify-around bg-[#ffffff] pr-12 font-bold text-[#ff0000] hover:bg-gray-300/30 hover:text-[#ff0000] hover:brightness-110"
          variant="ghost">
          <Icon name="ic:round-logout" class="h-6 w-6" />
          <p class="text-base">Logout</p>
        </UiButton>
      </div>
    </template>
    <ConfirmationModal v-model:open="logoutModal" title="Confirm Logout"
      description="Are you sure you want to log out ?" @confirm="handleLogout" />

    <form @submit="handleAccountUpdate" class="flex flex-col gap-2">
      <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
        Personal Information
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <TextField name="username" label="Full Name" helperText='enter your first name' required
          placeholder="Enter your full name" />
        <TextField type='email' name="email" label="Email address" helperText='' required
          placeholder="Enter your email address" />
        <div class='flex gap-2'>
          <CountryCodeField class='w-[100px]' name="countryCode" label="Country Code"
            helperText="Enter your country code" required />
          <TextField :disableCharacters="true" name="mobile" label="Mobile number" helperText='' required
            placeholder="Enter your mobile number" />
        </div>
      </div>
      <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
        Address Information
      </h3>
      <div class="grid grid-cols-2 gap-2">

        <TextField name="address.street" label="Street name" helperText='' required
          placeholder="Enter your street address" />
        <TextField name="address.city" label="city name" helperText='' required placeholder="Enter your city name" />
        <CountrySelectField name="address.country" label="country" helperText="Enter your country" required />
        <RegionSelectField name="address.state" label="state" helperText="select your state" required
          :country="values?.address?.country" />
        <TextField name='address.zipCode' label="zip code" helperText='' required placeholder="Enter your zip code"
          :disableCharacters="true" />
      </div>

      <div class="flex justify-end w-full ">
        <UiButton type="submit" color='primary'>Submit</UiButton>

      </div>
    </form>
  </Page>
</template>
<script setup lang="ts">
import { useForm } from "vee-validate";
const addressSchema = z.object({
  street: z.string({ required_error: "Street Name is required" }).min(2, "Street Name is required"),
  city: z.string({ required_error: "City Name is required" }).min(2, "City Name is required"),
  state: z.string({ required_error: "State Name is required" }).min(2, "State Name is required"),
  country: z.string({ required_error: "Country Name is required" }).min(2, "Country Name is required"),
  zipCode: z.string({ required_error: "zipCode is required" }).min(1, "zipCode is required"),
});

const accountSchema = toTypedSchema(
  z
    .object({
      username: z.string({ required_error: "Name is required" }).min(2, "Name must be at least 2 characters."),
      email: z.string({ required_error: "Email is required" }).email().default(""),
      mobile: z.string({ required_error: "Number is required" }).min(2, "Number must be provided."),
      password: z.string({ required_error: "Password is required" }).optional().default(""),
      confirmPassword: z.string({ required_error: "Confirm Password is required" }).optional().default(""),
      countryCode: z.string({ required_error: "Country Code is required" }).min(1, "Country Code is required"),
      address: addressSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"], // Point to the field that has the issue
    }),
);
const {
  errors,
  setErrors,
  setFieldValue,
  handleSubmit,
  defineField,
  values,
} = useForm({
  validationSchema: accountSchema,
});

const { user, refreshUser }: { user: any; refreshUser: any } =
  await useUser();
setFieldValue("countryCode", user?.value?.countryCode);
setFieldValue("username", user?.value?.username);
setFieldValue("email", user?.value?.email);
setFieldValue("mobile", user?.value?.mobile);
setFieldValue("address.street", user?.value?.address?.street);
setFieldValue("address.city", user?.value?.address?.city);
setFieldValue("address.state", user?.value?.address?.state);
setFieldValue("address.country", user?.value?.address?.country);
setFieldValue("address.zipCode", user?.value?.address?.zipCode);
const logoutModal = ref(false);

const confirmModel = () => {
  logoutModal.value = true;
  localStorage.clear()
};

const handleLogout = () => {
  authHandlers.logout();
  logoutModal.value = false;
};

const isUpdating = ref(false);
const handleAccountUpdate = handleSubmit(async (values: any) => {
  try {
    isUpdating.value = true;
    await $fetch("/api/user", { method: "PUT", body: values });
    refreshUser();
    toast.success("Account updated successfully");
  } catch (e) {
    console.error(e);
    toast.error("Failed to update account, please try again");
  } finally {
    isUpdating.value = false;
  }
});
</script>
