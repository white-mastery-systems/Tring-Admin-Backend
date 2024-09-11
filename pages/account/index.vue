<template>
  <Page title="My Account" :disable-back-button="true">
    <template #actionButtons>
      <div>
        <UiButton
          @click="confirmModel"
          class="items-start justify-around bg-[#ffffff] pr-12 font-bold text-[#ff0000] hover:bg-gray-300/30 hover:text-[#ff0000] hover:brightness-110"
          variant="ghost"
        >
          <Icon name="ic:round-logout" class="h-6 w-6" />
          <p class="text-base">Logout</p>
        </UiButton>
      </div>
    </template>
    <ConfirmationModal
      v-model:open="logoutModal"
      title="Confirm Logout"
      description="Are you sure you want to log out ?"
      @confirm="handleLogout"
    />
    <!-- v-slot="{ values, errors }"
      :validation-schema="accountSchema"
      :keep-values="true"
      :validate-on-mount="false"
      :initial-values="userInfo" -->
    <UiForm @submit="handleAccountUpdate">
      <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
        Personal Information
      </h3>

      <div class="grid grid-cols-2 gap-2 sm:grid-cols-1 md:grid-cols-2">
        <div>
          <UiFormField
            v-model="usernameField"
            v-bind="usernameFieldProps"
            name="username"
          >
            <UiFormItem class="w-full">
              <UiFormLabel
                >Full Name <UiLabel class="text-lg text-red-500">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput
                  v-model="usernameField"
                  v-bind="usernameFieldProps"
                  type="text"
                  placeholder="John Doe"
                />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
        </div>
        <div class="flex gap-2">
          <UiFormField
            v-model="countryCode"
            v-bind="countryCodeProps"
            name="countryCode"
            class="mt-1"
          >
            <UiFormItem class="mt-1">
              <UiFormLabel
                >Country code
                <span class="text-sm text-red-500">*</span>
              </UiFormLabel>
              <UiPopover>
                <UiPopoverTrigger as-child>
                  <UiFormControl>
                    <UiButton
                      variant="outline"
                      role="combobox"
                      :class="
                        cn(
                          'w-[200px] justify-between',
                          !values.countryCode && 'text-muted-foreground',
                        )
                      "
                    >
                      {{
                        values.countryCode
                          ? allCoutryDialCode.find(
                              (dialCode: any) =>
                                dialCode === values.countryCode,
                            )
                          : "Select code..."
                      }}
                      <ChevronsUpDown
                        class="ml-2 h-4 w-4 shrink-0 opacity-50"
                      />
                    </UiButton>
                  </UiFormControl>
                </UiPopoverTrigger>
                <UiPopoverContent class="w-[200px] p-0">
                  <UiCommand>
                    <!-- <UiCommandInput placeholder="Search code..." /> -->
                    <UiCommandEmpty>No codes found.</UiCommandEmpty>
                    <UiCommandList>
                      <div v-bind="containerProps" class="max-h-52">
                        <div v-bind="wrapperProps">
                          <UiCommandGroup>
                            <UiCommandItem
                              v-for="dialCode in countyDialCodes"
                              :key="dialCode.data"
                              :value="dialCode.data"
                              @select="
                                () => {
                                  setFieldValue('countryCode', dialCode.data);
                                }
                              "
                              style="height: 32px"
                            >
                              <Check
                                :class="
                                  cn(
                                    'mr-2 h-4 w-4',
                                    dialCode.data === values.countryCode
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )
                                "
                              />
                              {{ dialCode.data }}
                            </UiCommandItem>
                          </UiCommandGroup>
                        </div>
                      </div>
                    </UiCommandList>
                  </UiCommand>
                </UiPopoverContent>
              </UiPopover>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
          <UiFormField
            class="w-[80%]"
            v-model="mobileField"
            v-bind="mobileFieldProps"
            name="mobile"
          >
            <UiFormItem class="w-full">
              <UiFormLabel>
                Phone Number <UiLabel class="text-lg text-red-500">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput
                  v-model="mobileField"
                  v-bind="mobileFieldProps"
                  placeholder="Enter phone number"
                />
              </UiFormControl>
              <!-- <UiFormMessage :error="errors.phone?.number" /> -->
            </UiFormItem>
          </UiFormField>
        </div>
        <UiFormField v-model="emailField" v-bind="emailFieldProps" name="email">
          <UiFormItem class="w-full">
            <UiFormLabel
              >Email <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                v-bind="emailFieldProps"
                type="email"
                placeholder="Enter your email"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
      </div>
      <h3 class="mb-2 mt-4 scroll-m-20 text-2xl font-semibold tracking-tight">
        Address Information
      </h3>
      <div class="grid gap-2 sm:grid-cols-1 sm:gap-4 md:grid-cols-2">
        <UiFormField
          v-model="streetField"
          v-bind="streetFieldProps"
          name="address.street"
        >
          <UiFormItem class="w-full">
            <UiFormLabel>
              Street Name <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                v-model="streetField"
                v-bind="streetFieldProps"
                type="text"
                placeholder="Enter a Street Name"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-model="cityField"
          v-bind="cityFieldProps"
          name="address.city"
        >
          <UiFormItem class="w-full">
            <UiFormLabel
              >City Name <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                v-model="cityField"
                v-bind="cityFieldProps"
                type="text"
                placeholder="Enter a City Name"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiFormField
          v-model="countryField"
          v-bind="countryFieldProps"
          class="gap-2"
          name="address.country"
        >
          <UiFormItem class="flex w-full flex-col">
            <UiFormLabel class="mt-2"
              >Country
              <span class="text-sm text-red-500">*</span>
            </UiFormLabel>
            <UiPopover>
              <UiPopoverTrigger as-child>
                <UiFormControl>
                  <UiButton
                    variant="outline"
                    role="combobox"
                    :class="
                      cn(
                        'w-full justify-between',
                        !values?.address?.country && 'text-muted-foreground',
                      )
                    "
                  >
                    {{
                      values?.address?.country
                        ? allCoutryNames.find(
                            (country: any) =>
                              country === values?.address?.country,
                          )
                        : "Select country..."
                    }}
                    <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </UiButton>
                </UiFormControl>
              </UiPopoverTrigger>
              <UiPopoverContent class="w-[200px] p-0">
                <UiCommand>
                  <!-- <UiCommandInput placeholder="Search code..." /> -->
                  <UiCommandEmpty>No country found.</UiCommandEmpty>
                  <UiCommandList>
                    <div v-bind="containerPropsForCountry" class="max-h-52">
                      <div v-bind="wrapperPropsForCountry">
                        <UiCommandGroup>
                          <UiCommandItem
                            v-for="country in countriesList"
                            :key="country.data"
                            :value="country.data"
                            @select="
                              () => {
                                setFieldValue('address.country', country.data);
                              }
                            "
                            style="height: 32px"
                          >
                            <Check
                              :class="
                                cn(
                                  'mr-2 h-4 w-4',
                                  country.data === values?.address?.country
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )
                              "
                            />
                            {{ country.data }}
                          </UiCommandItem>
                        </UiCommandGroup>
                      </div>
                    </div>
                  </UiCommandList>
                </UiCommand>
              </UiPopoverContent>
            </UiPopover>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-model="stateField"
          v-bind="stateFieldProps"
          class="gap-2"
          name="address.state"
        >
          <UiFormItem class="flex w-full flex-col">
            <UiFormLabel class="mt-2"
              >state
              <span class="text-sm text-red-500">*</span>
            </UiFormLabel>
            <UiPopover>
              <UiPopoverTrigger as-child>
                <UiFormControl>
                  <UiButton
                    variant="outline"
                    role="combobox"
                    :class="
                      cn(
                        'w-full justify-between',
                        !values?.address?.state && 'text-muted-foreground',
                      )
                    "
                  >
                    {{
                      values?.address?.state
                        ? statesList.find(
                            (state: any) => state === values?.address?.state,
                          )
                        : "Select state..."
                    }}
                    <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </UiButton>
                </UiFormControl>
              </UiPopoverTrigger>
              <UiPopoverContent class="w-[200px] p-0">
                <UiCommand>
                  <!-- <UiCommandInput placeholder="Search code..." /> -->
                  <UiCommandEmpty>No state found.</UiCommandEmpty>
                  <UiCommandList>
                    <div v-bind="containerPropsForState" class="max-h-52">
                      <div v-bind="wrapperPropsForState">
                        <UiCommandGroup>
                          <UiCommandItem
                            v-for="state in stateRenderList"
                            :key="state.data"
                            :value="state.data"
                            @select="
                              () => {
                                setFieldValue('address.state', state.data);
                              }
                            "
                            style="height: 32px"
                          >
                            <Check
                              :class="
                                cn(
                                  'mr-2 h-4 w-4',
                                  state.data === values?.address?.state
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )
                              "
                            />
                            {{ state.data }}
                          </UiCommandItem>
                        </UiCommandGroup>
                      </div>
                    </div>
                  </UiCommandList>
                </UiCommand>
              </UiPopoverContent>
            </UiPopover>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-model="zipCodeField"
          v-bind="zipCodeFieldProps"
          name="address.zipCode"
        >
          <UiFormItem class="w-full">
            <UiFormLabel>
              Zip Code <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                v-model="zipCodeField"
                v-bind="zipCodeFieldProps"
                type="text"
                placeholder="Enter a zipCode"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
      </div>
      <div class="mt-6 flex justify-end">
        <UiButton
          color="primary"
          class="w-[200px] justify-self-end"
          type="submit"
          :disabled="isUpdating"
        >
          Update Profile
        </UiButton>
      </div>
    </UiForm>
  </Page>
</template>
<script setup lang="ts">
  import { Check, ChevronsUpDown } from "lucide-vue-next";
  import { useForm } from "vee-validate";
  import countryData from "~/assets/country-codes.json";
  import stateData from "~/assets/state.json";

  const countryListOpen = ref(false);
  const value = ref("");

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
        mobile: z.string().min(2, "Number must be provided."),
        password: z.string().optional().default(""),
        confirmPassword: z.string().optional().default(""),
        countryCode: z.string().min(1, "Country Code is required"),
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
  watch(errors, (newError) => {
    console.log({ newError });
  });
  const [usernameField, usernameFieldProps] = defineField("username");
  const [emailField, emailFieldProps] = defineField("email");
  const [mobileField, mobileFieldProps] = defineField("mobile");
  const [countryCode, countryCodeProps] = defineField("countryCode");
  const [stateField, stateFieldProps] = defineField("address.state");
  const [cityField, cityFieldProps] = defineField("address.city");
  const [countryField, countryFieldProps] = defineField("address.country");
  const [streetField, streetFieldProps] = defineField("address.street");
  const [zipCodeField, zipCodeFieldProps] = defineField("address.zipCode");

  const { user, refreshUser }: { user: any; refreshUser: any } =
    await useUser();
  console.log({ user: user?.value });
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
  const allCoutryDialCode = computed(() =>
    countryData?.map((country) => country.dial_code),
  );
  const {
    list: countyDialCodes,
    containerProps,
    wrapperProps,
  } = useVirtualList(allCoutryDialCode, {
    itemHeight: 32,
  });

  const allCoutryNames = computed(() =>
    countryData?.map((country) => country.name),
  );
  const {
    list: countriesList,
    containerProps: containerPropsForCountry,
    wrapperProps: wrapperPropsForCountry,
  } = useVirtualList(allCoutryNames, {
    // Keep `itemHeight` in sync with the item's row.
    itemHeight: 32,
  });
  const statesList: any = computed(() => {
    const data = stateData
      ?.filter(({ country_name }) => country_name === values?.address?.country)
      .map((item) => item.name);
    // stateData?.map((state) => {
    //   console.log({ state }, values?.address?.country);
    // });
    console.log({ data });
    return data;
  });
  const {
    list: stateRenderList,
    containerProps: containerPropsForState,
    wrapperProps: wrapperPropsForState,
  } = useVirtualList(statesList, {
    // Keep `itemHeight` in sync with the item's row.
    itemHeight: 32,
  });
  const confirmModel = () => {
    logoutModal.value = true;
  };

  const handleLogout = () => {
    authHandlers.logout();
    logoutModal.value = false;
  };

  // const states = reactive(["California", "Texas", "New York", "Florida"])

  const isUpdating = ref(false);

  const states: any = ref();

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
