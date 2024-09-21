<template>
  <Page title="My Account" :disable-back-button="true">
    <UiTabs default-value="PersonalDetails" class="w-full self-start">
      <UiTabsList class="grid w-full grid-cols-3">
        <UiTabsTrigger value="PersonalDetails" @click="selectedChannel('PersonalDetails')">
          Personal Details
        </UiTabsTrigger>
        <UiTabsTrigger value="privacy" @click="selectedChannel('privacy')">
          Privacy
        </UiTabsTrigger>
        <UiTabsTrigger value="companyDetails" @click="selectedChannel('companyDetails')">
          Company Details
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="PersonalDetails">
        <form @submit="handleAccountUpdate" class="flex flex-col gap-2">
          <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
            Personal Information
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <TextField name="username" label="Full Name" helperText="enter your first name" required
              placeholder="Enter your full name" />
            <TextField type="email" name="email" label="Email address" helperText="" required
              placeholder="Enter your email address" />



            <div class="flex gap-2 space-y-2">
              <CountryCodeField class="w-[100px] mt-2 space-y-2" name="countryCode" label="Country Code"
                helperText="Enter your country code" required />

              <TextField class="" :disableCharacters="true" name="mobile" label="Mobile number" helperText="" required
                placeholder="Enter your mobile number" />
            </div>
            <SelectField name="metadata.role" label="Role" placeholder="Select Role"
              :options="roles.map((role) => ({ label: role, value: role }))" :required="true" />
          </div>
          <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
            Address Information
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <TextField name="address.street" label="Street name" helperText="" required
              placeholder="Enter your street address" />
            <TextField name="address.city" label="city name" helperText="" required
              placeholder="Enter your city name" />
            <CountrySelectField name="address.country" label="country" helperText="Enter your country" required />
            <RegionSelectField name="address.state" label="state" helperText="select your state" required
              :country="values?.address?.country" />
            <TextField name="address.zipCode" label="zip code" helperText="" required placeholder="Enter your zip code"
              :disableCharacters="true" />
          </div>

          <div class="flex w-full justify-end">
            <UiButton type="submit" color="primary">Submit</UiButton>
          </div>
        </form>
      </UiTabsContent>
      <UiTabsContent value="privacy">
        <form @submit="handleAccountUpdate" class="flex flex-col gap-2">
          <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
            Privacy
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <div class="relative">
              <TextField :type="passwordVisible ? 'text' : 'password'" name="password" label="Password"
                placeholder="Password" required>
                <template #endIcon>
                  <div class="w-[30px] cursor-pointer" @click="togglePasswordVisibility" type="button">
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
                  <div class="w-[30px] cursor-pointer" @click="toggleConfirmPasswordVisibility" type="button">
                    <OpenEye v-if="confirmPasswordVisible" />
                    <CloseEyeIcon v-else />
                  </div>
                </template>
              </TextField>
            </div>
          </div>

          <div class="flex w-full justify-end">
            <UiButton type="submit" color="primary">Submit</UiButton>
          </div>
        </form>
      </UiTabsContent>
      <UiTabsContent value="companyDetails">
        <form class="space-y-2" @submit="handleAccountUpdate">
          <div class="flex flex-col gap-3">
            <TextField type="name" name="name" label="Company Name" placeholder="Enter your Company Name"
              :required="true" />

            <SelectField name="industry" label="Industry" placeholder="Select Role"
              :options="industry.map((role) => ({ label: role, value: role }))" :required="true" />
            <div v-if="values.industry === 'Other'">
              <TextField type="name" name="otherRole" :required="true" />
            </div>

            <SelectField name="avgTraffic" label="Monthly Website Traffic" placeholder="Select Traffic" :options="avgTraffic.map((role) => ({ label: role, value: role }))
              " :required="true" />

            <SelectField name="employeeCount" label="No. of Employees " placeholder="Select Employees" :options="employeeCount.map((role) => ({ label: role, value: role }))
              " :required="true" />

            <div class="flex w-full justify-end">
              <UiButton type="submit" color="primary">Submit</UiButton>
            </div>
          </div>
        </form>
      </UiTabsContent>
    </UiTabs>
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
  </Page>
</template>
<script setup lang="ts">
import { useForm } from "vee-validate";
import { accountSchema } from "~/validationSchema/account/accountSchema";
import { privacySchema } from "~/validationSchema/account/privacySchema";
import { formSchema } from "~/validationSchema/authValidation/onBoarding/2Validation";
const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};
const toggleConfirmPasswordVisibility = () => {
  confirmPasswordVisible.value = !confirmPasswordVisible.value;
};


let schema = ref(accountSchema);

const industry = [
  "Real Estate",
  "Finance",
  "Healthcare",
  "Technology",
  "Education",
  "Other",
];
const avgTraffic = [
  "Less than 100 visits",
  "100-500 visits",
  "500-1000 visits",
  "1000-5000 visits",
  "5000-10000 visits",
  "10000+ visits",
];
const employeeCount = [
  "Less than 10 employees",
  "10-50 employees",
  "50-100 employees",
  "100-500 employees",
  "500-1000 employees",
  "1000+ employees",
];
const {
  errors,
  setErrors,
  setFieldValue,
  handleSubmit,
  defineField,
  values,
  resetForm,
} = useForm({
  validationSchema: computed(() => schema.value),
  initialValues: {
    countryCode: "+91"
  }
});

const { user, refreshUser }: { user: any; refreshUser: any } =
  await useUser();

const { orgDetails } = await $fetch("/api/org", {
  method: "GET",
});

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

const logoutModal = ref(false);

const confirmModel = () => {
  logoutModal.value = true;
  localStorage.clear();
};

const handleLogout = () => {
  authHandlers.logout();
  logoutModal.value = false;
};

const isUpdating = ref(false);
const handleAccountUpdate = handleSubmit(async (values: any) => {
  try {
    isUpdating.value = true;

    if (tab.value === "companyDetails") {
      await $fetch("/api/org", {
        method: "PUT",
        body: values,
      });
      toast.success("Company Details updated successfully");
    } else {
      await $fetch("/api/user", { method: "PUT", body: values });
      refreshUser();
      toast.success("Account updated successfully");
      if (tab.value === "privacy") {
        resetForm();
      }
    }
  } catch (e) {
    console.error(e);
    toast.error("Failed to update account, please try again");
  } finally {
    isUpdating.value = false;
  }
});

const tab = ref("personalDetails");
const selectedChannel = (value: any) => {
  tab.value = value;
  if (value === "PersonalDetails") {
    schema.value = accountSchema;
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
  } else if (value === "privacy") {
    schema.value = privacySchema;
  } else {
    schema.value = formSchema;
    setFieldValue("name", orgDetails?.name);
    setFieldValue("industry", orgDetails?.metadata?.industry);
    setFieldValue("customIndustry", orgDetails?.metadata?.customIndustry);
    setFieldValue("avgTraffic", orgDetails?.metadata?.avgTraffic);
    setFieldValue("employeeCount", orgDetails?.metadata?.employeeCount);
    if (orgDetails?.metadata?.industry === 'Other') {
      setFieldValue("otherRole", orgDetails?.metadata?.otherRole);

    }

  }
};

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
