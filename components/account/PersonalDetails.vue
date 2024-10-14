<template>
  <div class="min-h-screen overflow-auto">
    <form @submit="handleAccountUpdate" class="flex flex-col gap-2">
      <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
        Personal Information
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <TextField
          name="username"
          label="Full Name"
          helperText="enter your first name"
          required
          placeholder="Enter your full name"
        />
        <TextField
          type="email"
          name="email"
          label="Email address"
          helperText=""
          required
          placeholder="Enter your email address"
        />
      </div>
      <div
        class="grid grid-cols-1 gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
      >
        <div class="flex gap-2">
          <CountryCodeField
            class="w-[100px]"
            name="countryCode"
            label="Country Code"
            helperText="Enter your country code"
            required
          />

          <TextField
            :disableCharacters="true"
            name="mobile"
            label="Mobile number"
            helperText=""
            required
            placeholder="Enter your mobile number"
          />
        </div>
        <!-- {{ values }} -->
        <div class="w-full">
          <SelectField
            name="metadata.role"
            label="Role"
            placeholder="Select Role"
            :options="roles.map((role) => ({ label: role, value: role }))"
            :required="true"
          />

          <TextField
            v-if="values.metadata?.role === 'Other'"
            type="text"
            name="metadata.otherRole"
            :required="true"
          />
        </div>
      </div>
      <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
        Address Information
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <TextField
          name="address.street"
          label="Street name"
          helperText=""
          required
          placeholder="Enter your street address"
        />
        <TextField
          name="address.city"
          label="city name"
          helperText=""
          required
          placeholder="Enter your city name"
        />
        <CountrySelectField
          name="address.country"
          label="country"
          helperText="Enter your country"
          required
        >
        </CountrySelectField>
        <RegionSelectField
          name="address.state"
          label="state"
          helperText="select your state"
          required
          :country="values?.address?.country"
        />
        <TextField
          name="address.zipCode"
          label="zip code"
          helperText=""
          required
          placeholder="Enter your zip code"
          :disableCharacters="true"
        />
        <!-- <ComboBoxField
          name="data"
          label="data"
          helperText="enter your data"
          required
          placeholder="Enter your data"
          :allCodes="[
            { label: 'hi', value: 'hi' },
            { label: 'djj', value: 'djj' },
            { label: 'asdf', value: 'asdf' },
          ]"
        /> -->
      </div>

      <div class="flex w-full justify-end">
        <UiButton type="submit" color="primary" size="lg" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { accountSchema } from "~/validationSchema/account/accountSchema";

  const {
    errors,
    setErrors,
    setFieldValue,
    handleSubmit,
    defineField,
    values,
    resetForm,
  } = useForm({
    validationSchema: accountSchema,
    initialValues: {
      countryCode: "+91",
    },
  });

  const isLoading = ref(false);
  const { user, refreshUser }: { user: any; refreshUser: any } =
    await useUser();

  setFieldValue("countryCode", user?.value?.countryCode ?? "+91");
  setFieldValue("username", user?.value?.username);
  setFieldValue("email", user?.value?.email);
  setFieldValue("mobile", user?.value?.mobile);
  setFieldValue("address.street", user?.value?.address?.street);
  setFieldValue("address.city", user?.value?.address?.city);
  setFieldValue("address.state", user?.value?.address?.state);
  setFieldValue("address.country", user?.value?.address?.country);
  setFieldValue("address.zipCode", user?.value?.address?.zipCode);
  setFieldValue("metadata.role", user?.value?.metadata?.role);
  setFieldValue("metadata.otherRole", user?.value?.metadata?.otherRole);

  const handleAccountUpdate = handleSubmit(async (values: any) => {
    isLoading.value = true;
    try {
      await $fetch("/api/user", { method: "PUT", body: values });
      refreshUser();
      toast.success("Account updated successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update account, please try again");
    } finally {
      isLoading.value = false;
    }
    isLoading.value = false;
  });

  const roles = [
    "Chief Executive Officer",
    "Chief Financial Officer",
    "Chief Technology Officer",
    "Chief Operating Officer",
    "Chief Information Officer",
    "Chief Marketing Officer",
    "Sales",
    "Other",
  ];
</script>
