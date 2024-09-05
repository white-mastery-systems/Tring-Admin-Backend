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
    <UiForm v-slot="{ values, errors }" :validation-schema="accountSchema" :keep-values="true"
      :validate-on-mount="false" :initial-values="userInfo" @submit="handleAccountUpdate">
      <div class="grid gap-2 sm:grid-cols-1 sm:gap-4 md:grid-cols-2">
        <div>
          <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
            Personal Information
          </h3>
          <UiFormField v-slot="{ componentField }" name="username">
            <UiFormItem class="w-full">
              <UiFormLabel>Full Name <UiLabel class="text-lg text-red-500">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" type="text" placeholder="John Doe" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
          <UiFormField v-slot="{ componentField }" name="email">
            <UiFormItem class="w-full">
              <UiFormLabel>Email <UiLabel class="text-lg text-red-500">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" type="email" placeholder="user@example.com" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
        </div>
        <div>
          <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
            Change password
          </h3>
          <UiFormField v-slot="{ componentField }" name="password">
            <UiFormItem class="w-full">
              <UiFormLabel>Password <UiLabel class="text-lg text-red-500">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" type="text" placeholder="Password" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
          <UiFormField v-slot="{ componentField }" name="confirmPassword">
            <UiFormItem class="w-full">
              <UiFormLabel>Re enter your password
                <UiLabel class="text-lg text-red-500">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" type="password" placeholder="Re enter your password" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
        </div>
      </div>
      <h3 class="mb-2 mt-4 scroll-m-20 text-2xl font-semibold tracking-tight">
        Address Information
      </h3>
      <div class="grid gap-2 sm:grid-cols-1 sm:gap-4 md:grid-cols-2">
        <UiFormField v-slot="{ componentField }" name="address.street">
          <UiFormItem class="w-full">
            <UiFormLabel> Street Name <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" type="text" placeholder="Enter a Street Name" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="address.city">
          <UiFormItem class="w-full">
            <UiFormLabel>City Name <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" type="text" placeholder="Enter a City Name" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="address.state">
          <UiFormItem class="w-full">
            <UiFormLabel>State Name <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" type="text" placeholder="Enter a State Name" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="address.country">
          <UiFormItem class="w-full">
            <UiFormLabel>country Name <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" type="text" placeholder="Enter a country Name" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="address.zipCode">
          <UiFormItem class="w-full">
            <UiFormLabel> zipCode <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" type="text" placeholder="Enter a zipCode" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
      </div>
      <div class="flex justify-end mt-6">
        <UiButton color="primary" class="w-[200px] justify-self-end" type="submit" :disabled="isUpdating">
          Update Profile
        </UiButton>
      </div>
    </UiForm>
  </Page>
</template>
<script setup lang="ts">
  const { user, refreshUser } = await useUser();
  const userInfo = computed<Record<string, string>>(() => {
    if (!user?.value) {
      return {};
    }
    let result: Record<string, string> = {};
    Object.entries(user.value).map(([key, value]) => {
      if (typeof value === "string") {
        result[key] = value;
      }
    });
    return result;
  });
  const logoutModal = ref(false);

  const confirmModel = () => {
    logoutModal.value = true;
  };

  const handleLogout = () => {
    authHandlers.logout();
    logoutModal.value = false;
  };

  const addressSchema = z.object({
    street: z.string().min(2, "Street Name is required"),
    city: z.string().min(2, "City Name is required"),
    state: z.string().min(2, "State Name is required"),
    country: z.string().min(2, "Country Name is required"),
    zipCode: z.string()
      .regex(/^\d{5}(-\d{4})?$/, "Invalid zip code format")
      .min(1, "zipCode is required"),
  });

  const accountSchema = toTypedSchema(
    z
      .object({
        username: z.string().min(2, "Name must be at least 2 characters."),
        email: z.string().email().default(""),
        password: z.string().optional().default(""),
        confirmPassword: z.string().optional().default(""),
        address: addressSchema,
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"], // Point to the field that has the issue
      }),
  );

  const isUpdating = ref(false);
  const handleAccountUpdate = async (values: Record<string, string>) => {
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
  };
</script>
