<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <!-- :initial-values="defaultFormValues" -->
    <!-- @submit="handleSubmit" -->
    <div class="w-[90%] px-0 pb-[20px] font-bold text-[#424bd1] md:w-[80%] lg:w-[90%] lg:px-6 xl:w-[80%]">
      Personal Details
    </div>
    <div class="flex w-[90%] flex-col px-0 md:w-[80%] lg:w-[90%] lg:px-6 xl:w-[80%]">
      <!-- <div> -->
      <form class="space-y-4" @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-3 h-[50vh] overflow-y-scroll table-scroll p-2">
          <TextField type="text" name="name" label="Full Name" placeholder="Enter Your Name" :required="true" />
          <TextField type="text" name="businessName" label="Business Name" placeholder="Enter Your Business Name"
            :required="true" />

          <!-- <TextField type="text" name="planToBuild" label="What do you plan to build with" placeholder="Enter Your Plan"
            :required="true" /> -->
            <div class="flex flex-col gap-3">
              <SelectField
                name="planToBuild"
                label="What do you plan to build with"
                placeholder="Enter Your Plan"
                :options="planToBuildList.map((list) => ({ label: list, value: list }))"
                required="true"
                v-model="formData.planToBuild"
              />
              <TextField
                v-if="formData.planToBuild === 'Other'"
                type="text"
                name="otherPlan"
                label="Custom Plan"
                placeholder="Enter Your Custom Plan"
                v-model="formData.otherPlan"
              />
            </div>
          <!-- <TextField type="text" name="referralSource" label="What brought you to"
            placeholder="Enter Your Referral Source" :required="true" /> -->
            <div class="flex flex-col gap-3">
              <SelectField
                name="referralSource"
                label="What brought you to"
                placeholder="Enter Your Referral Source"
                :options="referralSourceList.map((list) => ({ label: list, value: list }))"
                :required="true"
                v-model="formData.referralSource"
              />
              <TextField
                v-if="formData.referralSource === 'Other'"
                type="text"
                name="otherReferralSource"
                label="Custom Referral Source"
                placeholder="Enter Your Referral Source"
                v-model="formData.otherReferralSource"
              />
            </div>
          <!-- <TextField type="text" name="estimatedMonthlyBudget" label="your estimated monthly budget"
            placeholder="Enter Your Estimated Monthly Budget" :required="true" /> -->
            
            <div class="flex flex-col gap-3">
            <SelectField name="role" label="Role" placeholder="Select Role"
              :options="roles.map((role) => ({ label: role, value: role }))" :required="true" v-model="formData.role" />
            <!-- <TextField
              v-if="formData.role === 'Other'"
              type="text"
              name="otherRole"
              label="Custom Role"
              placeholder="Enter Your Role"
              v-model="formData.otherRole"
            /> -->
            <TextField v-if="formData.role === 'Other'" type="text" name="otherRole" label="Custom Role"
              placeholder="Enter Your Custom Role" v-model="formData.otherRole" />
          </div>
          <!-- <TextField type="text" name="discoverySource" label="Where you found us"
            placeholder="Enter Your Discovery Source" :required="true" /> -->
            <div class="flex flex-col gap-3">
              <SelectField
                name="discoverySource"
                label="Where you found us"
                placeholder="Enter Your Discovery Source"
                :options="discoverySourceList.map((list) => ({ label: list, value: list }))"
                :required="true"
                v-model="formData.discoverySource"
              />
              <TextField
                v-if="formData.discoverySource === 'Other'"
                type="text"
                name="otherDiscoverySource"
                label="Custom Discovery Source"
                placeholder="Enter Your Custom Discovery Source"
                v-model="formData.otherDiscoverySource"
              />
            </div>

            <div class="flex flex-col gap-3">
              <SelectField
                name="estimatedMonthlyBudget"
                label="your estimated monthly budget"
                placeholder="Enter Your Estimated Monthly..."
                :options="estimatedMonthlyBudgetList.map((list) => ({ label: list, value: list }))"
                :required="true"
                v-model="formData.estimatedMonthlyBudget"
              />
              <!-- <TextField
                v-if="formData.discoverySource === 'Other'"
                type="text"
                name="otherEstimatedMonthlyBudget"
                label="Custom Estimated Monthly Budget"
                placeholder="Enter Your Estimated Monthly Budget"
                v-model="formData.otherEstimatedMonthlyBudget"
              /> -->
            </div>
          <!-- <TextField type="text" name="country" label="Country" placeholder="Enter Your Country" :required="true" /> -->
          <!-- <CountryCodeField class="w-[100px]" name="country" label="Country" helperText="Enter your country" required /> -->
          <CountrySelectField name="country" label="country" helperText="Enter your country" required>
          </CountrySelectField>
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
        </div>
        <UiButton type="submit" class="flex h-[45px] w-full justify-center bg-[#424bd1] hover:bg-[#424bd1]"
          :loading="isLoading">Proceed
        </UiButton>
      </form>

      <!-- </div> -->
    </div>
    <div class="absolute bottom-[30px] flex items-center gap-1">
      <span class="text-[12px] text-[#8a8a8a]">
        By Signing up, I Agree to Tring AI
      </span>
      <a target="_blank" href="https://tringlabs.ai/terms-and-conditions" class="text-[12px] underline">
        Terms & Conditions
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defineEmits, defineProps } from 'vue';

const props = defineProps(['formData', 'setFieldValue', 'personalCompanyDetail']);
const emit = defineEmits(['next']);
const isLoading = ref(false)
const showCustomRoleInput = ref(false);
const roles = [
  "Business Owner",
  "Product Manager",
  "Marketing Manager",
  "Developer",
  "Other",
];

const planToBuildList = [
  'AI-Powered Chatbot',
  'AI-Powered Voice Bot',
  'Both Chatbot and Voice Bot',
  'Other',
]
const referralSourceList = [
  'Online Search',
  'Social Media',
  'Referral from a Friend/Colleague',
  'Advertisement',
  'Other',
]
const estimatedMonthlyBudgetList = [
  'Less than ₹5,000',
  '₹5,000 - ₹20,000',
  '₹20,000 - ₹50,000',  
  '₹50,000 - ₹1,00,000',
  'More than ₹1,00,000',
]
const discoverySourceList = [
  'Google Search',
  'LinkedIn',
  'Twitter/X',
  'Facebook',
  'Email Campaign',
  'Conference/Event',
  'Other',
]
props.setFieldValue('name', props?.formData?.name)
props.setFieldValue("planToBuild", props?.formData?.planToBuild)
props.setFieldValue("referralSource", props?.formData?.referralSource)
props.setFieldValue("estimatedMonthlyBudget", props?.formData?.estimatedMonthlyBudget)
props.setFieldValue("discoverySource", props?.formData?.discoverySource)
props.setFieldValue("businessName", props?.formData?.businessName)
props.setFieldValue("country", props?.formData?.country)
props.setFieldValue('role', props?.formData?.role)
props.setFieldValue('otherRole', props?.formData?.otherRole)
props.setFieldValue('otherPlan', props?.formData?.otherPlan)
props.setFieldValue('otherReferralSource', props?.formData?.otherReferralSource)
props.setFieldValue('otherDiscoverySource', props?.formData?.otherDiscoverySource)
props.setFieldValue('mobile', props?.formData?.mobile)
props.setFieldValue('countryCode', props?.formData?.countryCode)
// const handleRoleChange = (selectedRole: any) => {
//   showCustomRoleInput.value = selectedRole === 'Other';
// };

const onSubmit = () => {
  isLoading.value = true
  emit('next', {
    name: props.formData.name,
    role: props.formData.role,
    otherRole: props.formData.otherRole,
  });
  isLoading.value = false
};
</script>
