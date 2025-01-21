<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <!-- :initial-values="defaultFormValues" -->
    <!-- @submit="handleSubmit" -->
    <div class="w-[90%] px-0 pb-[20px] text-[28px] font-bold text-[#424bd1] md:w-[80%] lg:w-[90%] lg:px-6 xl:w-[80%]">
      Complete your profile!
    </div>
    <div class="flex w-[90%] flex-col px-0 md:w-[80%] lg:w-[90%] lg:px-6 xl:w-[80%]">
      <!-- <div> -->
      <form class="space-y-4" @submit.prevent="onSubmit">
        <!-- grid grid-cols-2 -->
        <div class="gap-3 p-1 space-y-4">
          <TextField type="text" name="name" label="Full Name" placeholder="Your Name" :required="true" />
          <TextField type="text" name="companyName" label="Company Name" placeholder="Company Name" :required="true" />
          <!-- <TextField type="text" name="businessName" label="Business Name" placeholder="Enter Your Business Name"
            :required="true" /> -->
          <!-- <TextField type="text" name="country" label="Country" placeholder="Enter Your Country" :required="true" /> -->
          <!-- <CountryCodeField class="w-[100px]" name="country" label="Country" helperText="Enter your country" required /> -->
          <div class="flex gap-3">
            <CountryCodeField name="countryCode" label="Country Code" helperText="your country code" required />

            <TextField :disableCharacters="true" name="mobile" label="Mobile number" helperText="" required
              placeholder="Mobile Number" />
          </div>
        </div>
        <UiButton type="submit" class="flex tex-[16px] h-[45px] w-full justify-center bg-[#424bd1] hover:bg-[#424bd1]"
          :loading="isLoading">Proceed
        </UiButton>
      </form>

      <!-- </div> -->
    </div>
    <div class="absolute bottom-[30px] flex items-center gap-1">
      <span class="text-[12px] text-[#8a8a8a]">
        By Signing up, I Agree to Tring AI
      </span>
      <a target="_blank" href="https://tringlabs.ai/terms-conditions" class="text-[12px] underline">
        Terms & Conditions
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

import { ref } from 'vue';
import { defineEmits, defineProps } from 'vue';
import { completeProfileSchema } from '~/validationSchema/authValidation/onBoarding/1Validation';
// const props = defineProps(['formData', 'setFieldValue', 'personalCompanyDetail', 'errors']);
const emit = defineEmits(['next']);
const isLoading = ref(false)

const {
  setFieldValue,
  handleSubmit,
  resetForm,
  values,
  errors,
} = useForm({
  validationSchema: completeProfileSchema,
  initialValues: {},
});

// setFieldValue('name', '')
// setFieldValue("planToBuild", formData?.planToBuild)
// // setFieldValue("referralSource", formData?.referralSource)
// setFieldValue("estimatedMonthlyBudget", formData?.estimatedMonthlyBudget)
// setFieldValue("discoverySource", formData?.discoverySource)
// // setFieldValue("businessName", formData?.businessName)
// setFieldValue("country", formData?.country)
// setFieldValue('role', formData?.role)
// setFieldValue('otherRole', formData?.otherRole)
// setFieldValue('otherPlan', formData?.otherPlan)
// setFieldValue('otherReferralSource', formData?.otherReferralSource)
// setFieldValue('otherDiscoverySource', formData?.otherDiscoverySource)
// setFieldValue('mobile', formData?.mobile)
// setFieldValue('countryCode', formData?.countryCode)


// const estimatedMonthlyBudgetList = computed(() => {
//   if (props.personalCompanyDetail.country === undefined) {
//     return [];
//   }
//   else if ((props.personalCompanyDetail.country !== 'India')) {
//     return [
//       'Less than $60',
//       '$60 - $240',
//       '$240 - $600',
//       '$600 - $1,200',
//       'More than $1,200'
//     ]
//   } else {
//     // console.log(props.personalCompanyDetail.country, "props.personalCompanyDetail.country -- props.personalCompanyDetail.country")
//     return [
//       'Less than ₹5,000',
//       '₹5,000 - ₹20,000',
//       '₹20,000 - ₹50,000',
//       '₹50,000 - ₹1,00,000',
//       'More than ₹1,00,000',
//     ]
//   }
// });
// watch(() => props.personalCompanyDetail.country, (newValue, oldValue) => {
//   if (props.personalCompanyDetail.estimatedMonthlyBudget) props.setFieldValue("estimatedMonthlyBudget", '')
// })
watch(errors, (newValue) => {
  console.log(newValue, "newValue")
})


const onSubmit = handleSubmit(async (values: any) => {
  isLoading.value = true
  await $fetch('/api/auth/onboarding', {
    method: 'POST',
    body: values,
  });

  // Navigate to success page
  navigateTo("/signUpSuccess");
  // emit('next', {
  //   name: props.formData.name,
  //   role: props.formData.role,
  //   otherRole: props.formData.otherRole,
  // });
  isLoading.value = false
});
</script>
