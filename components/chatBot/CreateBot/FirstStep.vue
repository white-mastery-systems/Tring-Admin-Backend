<script setup>
defineProps(['values', 'errors', 'setFieldValue']);

const handleLogoChange = (file) => {
  setFieldValue('logo', file);
};
</script>

<template>
  <div>
    <FileUpload @change="handleLogoChange" name="logo" label="Upload Image" :required="true" :accept="'image/*'"
      :url="values?.logo?.url" :fileType="'image'" class="h-24 cursor-pointer" />
    <span class="text-red-500">{{ errors.logo }}</span>

    <TextField type="text" name="name" label="Company Name" placeholder="Enter your Company Name"
      v-model="values.companyName" :required="true" />
    <span class="text-red-500">{{ errors.companyName }}</span>
  </div>
</template>
