<template>
  <Page title="My Account" :disable-back-button="true">
    <UiForm
      v-slot="{ values, errors }"
      :validation-schema="accountSchema"
      :keep-values="true"
      :validate-on-mount="false"
      :initial-values="userInfo"
      @submit="handleAccountUpdate"
      class="grid gap-2 sm:grid-cols-1 sm:gap-4 md:grid-cols-2"
    >
      <div>
        <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
          Personal Information
        </h3>
        <UiFormField v-slot="{ componentField }" name="username">
          <UiFormItem class="w-full">
            <UiFormLabel
              >Full Name <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                v-bind="componentField"
                type="text"
                placeholder="John Doe"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="email">
          <UiFormItem class="w-full">
            <UiFormLabel
              >Email <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                v-bind="componentField"
                type="email"
                placeholder="user@example.com"
              />
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
            <UiFormLabel
              >Password <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                v-bind="componentField"
                type="text"
                placeholder="Password"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="confirmPassword">
          <UiFormItem class="w-full">
            <UiFormLabel
              >Re enter your password
              <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                v-bind="componentField"
                type="password"
                placeholder="Re enter your password"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
      </div>
      <div></div>
      <UiButton
        color="primary"
        class="w-[200px] justify-self-end"
        type="submit"
      >
        Update Profile
      </UiButton>
    </UiForm>
  </Page>
</template>
<script setup lang="ts">
  const { user } = await useUser();
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
  const accountSchema = toTypedSchema(
    z.object({
      username: z.string().min(2, "Name must be at least 2 characters."),
      email: z.string().email().default(""),
      password: z.string().optional().default(""),
      confirmPassword: z.string().optional().default(""),
    }),
  );
  const handleAccountUpdate = (values) => {
    console.log({ values });
  };
</script>
