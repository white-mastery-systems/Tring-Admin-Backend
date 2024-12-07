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
        <div class="grid grid-cols-2 gap-3">
          <TextField type="text" name="name" label="Full Name" placeholder="Enter Your Name" :required="true" />
          <TextField type="text" name="planToBuild" label="Plan To Build" placeholder="Enter Your Plan"
            :required="true" />
          <TextField type="text" name="referralSource" label="Referral Source" placeholder="Enter Your Referral Source"
            :required="true" />
          <TextField type="text" name="estimatedMonthlyBudget" label="Estimated Monthly Budget"
            placeholder="Enter Your Estimated Monthly Budget" :required="true" />
          <TextField type="text" name="discoverySource" label="Discovery Source" placeholder="Enter Your Discovery Source"
            :required="true" />
          <TextField type="text" name="businessName" label="Business Name" placeholder="Enter Your Business Name"
            :required="true" />
          <TextField type="text" name="country" label="Country" placeholder="Enter Your Country" :required="true" />
  
          <SelectField name="role" label="Role" placeholder="Select Role"
            :options="roles.map((role) => ({ label: role, value: role }))" :required="true" v-model="formData.role" />
          <TextField v-if="formData.role === 'Other'" type="text" name="otherRole" label="Custom Role"
            placeholder="Enter Your Custom Role" v-model="formData.otherRole" />
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
  "Chief Executive Officer",
  "Chief Financial Officer",
  "Chief Technology Officer",
  "Chief Operating Officer",
  "Chief Information Officer",
  "Chief Marketing Officer",
  "Sales",
  "Other",
];
props.setFieldValue('name', props?.formData?.name)
props.setFieldValue("planToBuild", props?.formData?.planToBuild)
props.setFieldValue("referralSource", props?.formData?.referralSource)
props.setFieldValue("estimatedMonthlyBudget", props?.formData?.estimatedMonthlyBudget)
props.setFieldValue("discoverySource", props?.formData?.discoverySource)
props.setFieldValue("businessName", props?.formData?.businessName)
props.setFieldValue("country", props?.formData?.country)
props.setFieldValue('role', props?.formData?.role)
props.setFieldValue('otherRole', props?.formData?.otherRole)
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
