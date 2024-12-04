<template>
  <div class="pb-2">
    <form class="space-y-2" @submit="handleAccountUpdate">
      <div class="w-[49%] sm:w-[49%] md:w-[12%] lg:w-[12%] xl:w-[12%]">
        <FileUpload
          @change="handleLogoChange"
          name="logo"
          label="Upload Image"
          :required="true"
          :accept="'image/*'"
          :url="values?.logo?.url"
          :fileType="'image'"
          :class="'h-24 cursor-pointer'"
        />
      </div>
      <div
        class="grid grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:md:grid-cols-2"
      >
        <TextField
          helperText="Goods Service Tax"
          type="text"
          name="name"
          label="Company Name"
          placeholder="Enter your Company Name"
          :required="true"
        />

        <SelectField
          name="industry"
          label="Industry"
          placeholder="Select Role"
          :options="industry.map((role) => ({ label: role, value: role }))"
          :required="true"
        />
        <div v-if="values.industry === 'Other'">
          <TextField
            type="text"
            name="otherRole"
            label="Other Industry"
            :required="true"
          />
        </div>
        <SelectField
          name="avgTraffic"
          label="Monthly Website Traffic"
          placeholder="Select Traffic"
          :options="avgTraffic.map((role) => ({ label: role, value: role }))"
          :required="true"
        />
        <SelectField
          name="buisnessName"
          label="Business Name"
          placeholder="Select Buisness"
          :options="[
            { label: 'Buisness With Gst', value: 'businessWithGst' },
            { label: 'Buisness Without Gst', value: 'businessWithoutGst' },
          ]"
          :required="true"
        />

        <SelectField
          name="employeeCount"
          label="No. of Employees "
          placeholder="Select Employees"
          :options="employeeCount.map((role) => ({ label: role, value: role }))"
          :required="true"
        />

        <div class="mt-2">
          <TextField
            type="text"
            name="gst"
            label="GST"
            helperText="Enter your 15-digit GSTIN"
            placeholder="Enter Your Gst"
          />
        </div>
      </div>
      <div class="text-right">
        <UiButton type="submit" color="primary" size="lg" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { useOrgDetailsStore } from "~/store/orgDetailsStore";
  import { companyDetailsSchema } from "~/validationSchema/account/companyDetails";
  const useOrgDetails = useOrgDetailsStore();
  console.log(useOrgDetails);

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

  const {
    errors,
    setErrors,
    setFieldValue,
    handleSubmit,
    defineField,
    values,
    resetForm,
  } = useForm({
    validationSchema: companyDetailsSchema,
    initialValues: {},
  });
  const { orgDetails } = await companyDetails();
  const isLoading = ref(false);

  setFieldValue("name", orgDetails?.name);
  setFieldValue("industry", orgDetails?.metadata?.industry);
  // setFieldValue("customIndustry", orgDetails?.metadata?.customIndustry);
  setFieldValue("avgTraffic", orgDetails?.metadata?.avgTraffic);
  setFieldValue("employeeCount", orgDetails?.metadata?.employeeCount);
  setFieldValue("logo", orgDetails?.logo);
  if (orgDetails?.metadata?.industry === "Other") {
    setFieldValue("otherRole", orgDetails?.metadata?.otherRole);
  }

  if (orgDetails?.metadata?.gst)
    setFieldValue("gst", orgDetails?.metadata?.gst);

  const logoData = ref("");
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

      const orgData = await $fetch("/api/org", {
        method: "PUT",
        body: { ...value, logo: values.logo },
      });
      localStorage.setItem("orgDetails", JSON.stringify(orgData));
      useOrgDetails.updateValues();
      toast.success("Company Details updated successfully");
    } catch (e) {
      toast.error("Company Details failed to update");
      isLoading.value = false;
    }
    isLoading.value = false;
  });
</script>
