<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div
      class="flex w-[80%] items-center gap-1 px-[21px] pb-[20px] font-bold text-[#424bd1]"
    >
      <div class="flex cursor-pointer gap-2">
        <RightArrow @click="$emit('prev')" />
        <span> Company Details </span>
      </div>
    </div>
    <div class="flex w-[80%] flex-col overflow-y-auto px-6">
      <form @submit.prevent="onSubmit" class="space-y-2">
        <TextField
          type="text"
          name="companyName"
          label="Company Name"
          placeholder="Enter Your Company Name"
          :required="true"
        />
        <SelectField
          name="industry"
          label="Industry"
          placeholder="Select Industry"
          :options="industry.map((ind) => ({ label: ind, value: ind }))"
          :required="true"
          v-model="formData.industry"
        />

        <TextField
          v-if="formData.industry === 'Other'"
          type="text"
          placeholder="Your Industry"
          name="industryOtherRole"
          :required="true"
        />

        <SelectField
          name="avgTraffic"
          label="Monthly Website Traffic"
          placeholder="Select Traffic"
          :options="
            avgTraffic.map((traffic) => ({ label: traffic, value: traffic }))
          "
          :required="true"
          v-model="formData.avgTraffic"
        />
        <SelectField
          name="employeeCount"
          label="No. of Employees"
          placeholder="Select Employees"
          :options="
            employeeCount.map((count) => ({ label: count, value: count }))
          "
          :required="true"
          v-model="formData.employeeCount"
        />
        <UiButton
          type="submit"
          class="flex h-[45px] w-full justify-center bg-[#424bd1] hover:bg-[#424bd1]"
          :loading="isLoading"
          >Proceed
        </UiButton>
        <!-- <UiButton @click="$emit('prev')">Back</UiButton> -->
      </form>
      <div class="mt-2 flex items-center justify-center gap-1">
        <span class="text-[12px] text-[#8a8a8a]">
          By Signing up, I Agree to Tring AI
        </span>
        <a
          target="_blank"
          href="https://tringlabs.ai/terms-and-conditions"
          class="text-[12px] underline"
        >
          Terms & Conditions
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { defineEmits, defineProps } from "vue";
  const props = defineProps([
    "formData",
    "setFieldValue",
    "personalCompanyDetail",
  ]);
  const emit = defineEmits(["next", "prev"]);
  const isLoading = ref(false);

  const industry = [
    "Government Sectors",
    "Finance & Banking",
    "Real Estate",
    "Healthcare",
    "E-commerce",
    "Energy & Utilities",
    "Telecommunications",
    "Travel & Hospitality",
    "Logistics",
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

  props.setFieldValue("companyName", props.formData?.companyName);
  props.setFieldValue("industry", props.formData?.industry);
  props.setFieldValue("industryOtherRole", props.formData?.industryOtherRole);
  props.setFieldValue("avgTraffic", props.formData?.avgTraffic);
  props.setFieldValue("employeeCount", props.formData?.employeeCount);

  const onSubmit = () => {
    isLoading.value = true;
    emit("next", {
      companyName: props.formData.companyName,
      industry: props.formData.industry,
      industryOtherRole: props.formData.industryOtherRole,
      avgTraffic: props.formData.avgTraffic,
      employeeCount: props.formData.employeeCount,
    });
    isLoading.value = false;
  };
</script>
