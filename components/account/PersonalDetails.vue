<template>
  <!-- flex items-center -->
  <div :class="[((currentRoute === 'onboarding/account')) ? 'min-h[85vh]' : 'min-h-screen' ,'overflow-auto']">
    <form @submit="handleAccountUpdate" class="flex flex-col gap-2 p-1">
      <div v-show="props.personalControl" class="w-[49%] sm:w-[49%] md:w-[15%] lg:w-[15%] xl:w-[15%]">
        <FileUpload @change="handleLogoChange" name="logo" label="Upload Image" :required="true" :accept="'image/*'"
          :url="values.logo.url" :fileType="'image'" :class="'h-24 cursor-pointer'"
          :helperText="'Only files up to 5MB can be uploaded.'" />
      </div>
      <!-- v-show="props.personalControl" -->
      <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
        Personal Information
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <TextField name="username" label="Full Name" required placeholder="Enter your full name" />
        <TextField type="email" name="email" label="Email address" helperText="" required
          placeholder="Enter your email address" />
      </div>
      <div v-show="props.personalControl"
        class="grid grid-cols-1 gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        <TextField type="text" name="metadata.businessName" label="Business Name" placeholder="Enter Your Business Name"
          :required="true" />
        <div class="flex gap-2 w-full">
          <CountryCodeField class="w-[150px]" name="countryCode" label="Country Code"
            helperText="Enter your country code" required />

          <TextField :disableCharacters="true" name="mobile" label="Mobile number" helperText="" required
            placeholder="Enter your mobile number" />
        </div>
        <!-- {{ values }} -->
        <div class="w-full">
          <SelectField name="metadata.role" label="Role" placeholder="Select Role"
            :options="roles.map((role) => ({ label: role, value: role }))" />

          <TextField v-if="values?.metadata?.role === 'Other'" type="text" name="metadata?.otherRole"
            :required="true" />
        </div>
      </div>
      <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
        Company Information
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <TextField helperText="Goods Service Tax" type="text" name="name" label="Company Name"
          placeholder="Enter your Company Name" :required="true" />

        <SelectField name="industry" label="Industry" placeholder="Select Role"
          :options="industry.map((role) => ({ label: role, value: role }))" :required="true" />
        <div v-if="values.industry === 'Other'">
          <TextField type="text" name="otherRole" label="Other Industry" :required="true" />
        </div>
        <SelectField name="gstType" label="GST Type" placeholder="Select GST Type" :options="gstTypes" :required="true"
          helperText="Choose the GST type applicable to your business." />
        <TextField v-if="values.gstType === 'business_gst'" type="text" name="gst" label="GST"
          helperText="Enter your 15-digit GSTIN" placeholder="Enter Your Gst" required />
        <!-- <div class="flex gap-2 mt-2">
        </div> -->
      </div>
      <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
        Address Information
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <TextField name="address.street" label="Street name" helperText="" required
          placeholder="Enter your street address" />
        <TextField name="address.city" label="city name" helperText="" required placeholder="Enter your city name" />
        <CountrySelectField name="address.country" label="country" helperText="Enter your country" required>
        </CountrySelectField>
        <RegionSelectField name="address.state" label="state" helperText="select your state" required
          :country="values?.address?.country" />
        <TextField name="address.zipCode" label="zip code" helperText="" required placeholder="Enter your zip code"
          :disableCharacters="true" />
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
    <div v-if="(currentRoute === 'onboarding/account')"
      class="flex items-center justify-end w-full cursor-pointer text-[#8080809c] pt-3 pr-1">
      <div @click="proceedLogin()" class="flex items-center gap-2">
        <span class="flex items-center">
          Continue with the free plan
        </span>
        <ArrowRight class="w-5 h-5" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { accountSchema } from "~/validationSchema/account/accountSchema";
import { useOrgDetailsStore } from "~/store/orgDetailsStore";
import { ArrowRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router';
import { helpers } from "handlebars";
import { industry } from "~/composables/botManagement/chatBot/useBotType";

const props = withDefaults(defineProps<{ personalControl?: boolean }>(), {
  personalControl: true,
});
const router = useRouter();
const gstTypes = [
  {
    label: "Registered Business - Regular",
    value: "business_gst",
    helperText: "Business that is registered under GST"
  },
  {
    label: "Unregistered Business",
    value: "business_none",
    helperText: "Business that has not been registered under GST"
  },
  {
    label: "Consumer",
    value: "consumer",
    helperText: "A customer who is a regular consumer"  
  },
  {
    label: "Overseas",
    value: "overseas",
    helperText: "Persons with whom you do import or export of supplies outside india"
  }
];

const useOrgDetails = useOrgDetailsStore();

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
const logoData = ref("");
const isLoading = ref(false);
const { user, refreshUser }: { user: any; refreshUser: any } =
  await useUser();
if (!user.value) {
  user.value = await getUserDetail();
}
// const { orgDetails } = await fetch("/api/org", {
//   method: "GET",
// });
const { orgDetails } = await $fetch('/api/org')
setFieldValue("countryCode", user?.value?.countryCode ?? "+91");
setFieldValue("username", user?.value?.username ?? "");
setFieldValue("email", user?.value?.email ?? "");
// setFieldValue("mobile", user?.value?.mobile ?? "");
setFieldValue("address.street", user?.value?.address?.street ?? "");
setFieldValue("address.city", user?.value?.address?.city ?? "");
setFieldValue("address.state", user?.value?.address?.state ?? "");
setFieldValue("address.country", user?.value?.address?.country ?? "");
setFieldValue("address.zipCode", user?.value?.address?.zipCode ?? "");
setFieldValue("metadata.role", user?.value?.metadata?.role ?? "");
setFieldValue("metadata.otherRole", user?.value?.metadata?.otherRole ?? "");
setFieldValue("metadata.businessName", user?.value?.metadata?.businessName ? user?.value?.metadata?.businessName : orgDetails?.name ?? "");
setFieldValue("name", orgDetails?.name ?? "");
setFieldValue("industry", orgDetails?.metadata?.industry ?? "");
setFieldValue("logo", orgDetails?.logo ?? "");
if (orgDetails?.metadata?.industry === "Other") {
  setFieldValue("otherRole", orgDetails?.metadata?.otherRole ?? "");
}
if (orgDetails?.metadata?.gst)
setFieldValue("gst", orgDetails?.metadata?.gst ?? "");
setFieldValue("gstType", orgDetails?.metadata?.gstType ?? "");
// if (orgDetails?.metadata?.industry === "Other") {
// }
const handleLogoChange = async (event: any) => {
  logoData.value = event[0];

  const reader = new FileReader();
  reader.onload = (e) => {
    setFieldValue("logo", { url: e.target.result });
  };
  reader.readAsDataURL(logoData.value);
};

const handleAccountUpdate = handleSubmit(async (value: any) => {
  isLoading.value = true;
  try {
    if (logoData.value instanceof File) {
      const formData = new FormData();
      formData.append("files", logoData.value);
      const [res] = await $fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      setFieldValue("logo", res);
      logoData.value = "";
    }
    await $fetch("/api/user", { method: "PUT", body: {...value, logo: values.logo} });
    const { orgDetails } = await $fetch('/api/org')
    localStorage.setItem("orgDetails", JSON.stringify(orgDetails));
    useOrgDetails.updateValues();
    refreshUser();
    localStorage.setItem("user", JSON.stringify(user.value));
    toast.success("Account updated successfully");
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false;
  }
  isLoading.value = false;
});

const currentRoute = computed(() => {
  const fullPath = router.options.history.state.current
  if (!fullPath) return '';
  return fullPath.split('/auth/')[1] || '';
});

const roles = [
  "Business Owner",
  "Product Manager",
  "Marketing Manager",
  "Developer",
  "Other",
];

const proceedLogin = async () => {
  // refreshUser();
  navigateTo("/");
};
</script>
