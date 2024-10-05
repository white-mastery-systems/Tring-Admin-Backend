<template>
  <form class="space-y-2" @submit="handleAccountUpdate">
    <div class="flex flex-col gap-3">
      <TextField type="text" name="name" label="Company Name" placeholder="Enter your Company Name" :required="true" />

      <SelectField name="industry" label="Industry" placeholder="Select Role"
        :options="industry.map((role) => ({ label: role, value: role }))" :required="true" />
      <div v-if="values.industry === 'Other'">
        <TextField type="text" name="otherRole" :required="true" />
      </div>

      <SelectField name="avgTraffic" label="Monthly Website Traffic" placeholder="Select Traffic"
        :options="avgTraffic.map((role) => ({ label: role, value: role }))" :required="true" />

      <SelectField name="employeeCount" label="No. of Employees " placeholder="Select Employees"
        :options="employeeCount.map((role) => ({ label: role, value: role }))" :required="true" />

      <div class="flex w-full justify-end">
        <UiButton type="submit" color="primary" size="lg">
          <template v-if="isLoading">
            <Icon name="svg-spinners:90-ring-with-bg" class="h-6 w-6 animate-spin text-white" />
          </template>
          <template v-else>
            Submit
          </template>
        </UiButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { formSchema } from "~/validationSchema/authValidation/onBoarding/2Validation";

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
    validationSchema: formSchema,
    initialValues: {},
  });
  const { orgDetails } = await companyDetails()
  const isLoading = ref(false)

  setFieldValue("name", orgDetails?.name);
  setFieldValue("industry", orgDetails?.metadata?.industry);
  // setFieldValue("customIndustry", orgDetails?.metadata?.customIndustry);
  setFieldValue("avgTraffic", orgDetails?.metadata?.avgTraffic);
  setFieldValue("employeeCount", orgDetails?.metadata?.employeeCount);
  if (orgDetails?.metadata?.industry === "Other") {
    setFieldValue("otherRole", orgDetails?.metadata?.otherRole);
  }

  const handleAccountUpdate = handleSubmit(async (values: any) => {
    isLoading.value = true
    try{
   const orgData = await $fetch("/api/org", {
      method: "PUT",
      body: values,
    });
    localStorage.setItem("orgDetails", JSON.stringify(orgData));
    
    toast.success("Company Details updated successfully");
    }
    catch(e){
      toast.error("Company Details failed to update");
      isLoading.value = false
    }
    isLoading.value = false
  });
</script>
