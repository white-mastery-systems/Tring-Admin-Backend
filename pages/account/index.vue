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
          <div class="flex gap-2 items-center">
            <UiFormField class="max-w-[20%]" v-slot="{ componentField }" name="countryCode">
              <UiFormItem class="w-[30%]">
                <UiFormLabel class="text-[10px]">
                  Country Code
                  <UiLabel class="text-lg text-red-500">*</UiLabel>
                </UiFormLabel>
                <UiFormControl>
                  <UiSelect v-bind="componentField" class="w-1/4">
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Country Code" />
                    </UiSelectTrigger>
                    <UiSelectContent>
                      <div v-for="(list, index) in countryList">
                        <UiSelectItem :value="list.dial_code">{{ list.dial_code }}</UiSelectItem>
                      </div>
                    </UiSelectContent>
                  </UiSelect>
                </UiFormControl>
                <!-- <UiFormMessage :error="errors.phone?.countryCode" /> -->
              </UiFormItem>
            </UiFormField>

            <!-- Phone Number Field -->
            <UiFormField class="w-[80%]" v-slot="{ componentField }" name="mobile">
              <UiFormItem class="w-full">
                <UiFormLabel>
                  Phone Number <UiLabel class="text-lg text-red-500">*</UiLabel>
                </UiFormLabel>
                <UiFormControl>
                  <UiInput v-bind="componentField" placeholder="Enter phone number" />
                </UiFormControl>
                <!-- <UiFormMessage :error="errors.phone?.number" /> -->
              </UiFormItem>
            </UiFormField>
          </div>
          <UiFormField v-slot="{ componentField }" name="mobile">
            <UiFormItem class="w-full">
              <UiFormLabel>Number <UiLabel class="text-lg text-red-500">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" type="text" placeholder="Enter a Number" />
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
            <UiFormLabel> State Name <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField">
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select a State" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <div v-for="(list, index) in stateList">
                    <UiSelectItem :value="list.name">{{ list.name }} </UiSelectItem>
                  </div>
                </UiSelectContent>
              </UiSelect>
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="address.country">
          <UiFormItem class="w-full">
            <UiFormLabel> country Name <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-model="SelectedCountry" v-bind="componentField">
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select a Country" />
                </UiSelectTrigger>
                <!-- {{ countries }} -->
                <UiSelectContent>
                  <div v-for="(list, index) in countryList">
                    <UiSelectItem :value="list.name">{{ list?.name }} </UiSelectItem>
                  </div>
                </UiSelectContent>
              </UiSelect>
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
import countryData from '~/assets/country-codes.json'
// import countryData from '~/assets/country-codes.json'
import stateData from '~/assets/state.json'
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
  const countryList = ref(countryData);
  const stateList: any = ref(stateData);
  const selectedCountryDistrict = ref()
  const SelectedCountry = ref()
  const confirmModel = () => {
    logoutModal.value = true;
  };

// watch(() => SelectedCountry.value, (newValue) => {
//   console.log(newValue, "newValue")
//   selectedCountryDistrict.value = stateList.value.filter((item: any) => item.country_name === newValue);
//   console.log(selectedCountryDistrict.value, 'electedCountryDistrict.value');
// });


  const handleLogout = () => {
    authHandlers.logout();
    logoutModal.value = false;
  };

  const addressSchema = z.object({
    street: z.string().min(2, "Street Name is required"),
    city: z.string().min(2, "City Name is required"),
    state: z.string().min(2, "State Name is required"),
    country: z.string().min(2, "Country Name is required"),
    zipCode: z.string().min(1, "zipCode is required"),
  });

  const accountSchema = toTypedSchema(
    z
      .object({
        username: z.string().min(2, "Name must be at least 2 characters."),
        email: z.string().email().default(""),
        mobile: z.number().min(2, "Number must be provided."),
        password: z.string().optional().default(""),
        confirmPassword: z.string().optional().default(""),
        countryCode: z.string().min(1, 'Country Code is required'),
        address: addressSchema,
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"], // Point to the field that has the issue
      }),
  );
  // const states = reactive(["California", "Texas", "New York", "Florida"])

  const isUpdating = ref(false);

  const states: any = ref();

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
