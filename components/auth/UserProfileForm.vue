<script setup lang="ts">
import { completeProfileSchema } from '~/validationSchema/authValidation/onBoarding/1Validation';
import CountryCodeField from '../formComponents/CountryCodeField.vue';

definePageMeta({
  layout: "auth",
});

useHead({
  title: 'Complete Your Profile | Tring AI',
  meta: [
    { name: 'Description', content: 'Complete your profile on Tring AI to enhance your personalized AI-powered business solutions. Provide your name, company details, and phone number to unlock seamless AI-powered experiences.' }
  ]
})

const isLoading = ref(false)

const {
  setFieldValue,
  handleSubmit,
  defineField,
  resetForm,
  values,
  errors,
} = useForm({
  validationSchema: completeProfileSchema,
  initialValues: {
    name: "",
    companyName: "",
    mobile: "",
    countryCode: "",
  },
});

const [name, nameAttrs] = defineField("name");
const [companyName, companyNameAttrs] = defineField("companyName");
const [mobile, mobileAttrs] = defineField("mobile");
const [countryCode, countryCodeAttrs] = defineField("countryCode");

const onSubmit = handleSubmit(async (values: any) => {
  isLoading.value = true
  try {
    await $fetch('/api/auth/onboarding', {
      method: 'POST',
      body: values,
    });

    // Navigate to success page
    navigateTo("/auth/onboarding/billing");
  } catch (error) {
    toast.error(error?.statusMessage);
  } finally {
    isLoading.value = false
  }
});
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-3">
        <div class="grid gap-1">
          <Label class="sr-only" for="name">Name</Label>
          <UiInput id="name" v-model="name" v-bind="nameAttrs" placeholder="Your Full Name" type="text"
            :disabled="isLoading" />
          <p v-if="errors.name" class="text-[#ef4444] text-[13px]">{{ errors.name }}</p>
        </div>

        <div class="grid gap-1">
          <Label class="sr-only" for="companyName">Company Name</Label>
          <UiInput id="companyName" v-model="companyName" v-bind="companyNameAttrs" placeholder="Company Name"
            type="text" :disabled="isLoading" />
          <p v-if="errors.companyName" class="text-[#ef4444] text-[13px]">{{ errors.companyName }}</p>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex gap-2">
            <div class="grid gap-1">
              <Label class="sr-only" for="countryCode">Country Code</Label>
              <!-- <UiInput id="countryCode" v-model="countryCode" v-bind="countryCodeAttrs" placeholder="+1" type="text"
                :disabled="isLoading" /> -->
              <!-- <CountryCodeField v-model="countryCode" v-bind="countryCodeAttrs" :disabled="isLoading" /> -->
              <!-- <p v-if="errors.countryCode" class="text-red-500 text-sm">{{ errors.countryCode }}</p> -->
              <CountryCodeField class="max-w-[120px]" name="countryCode" label="Country Code"
                helperText="Enter your country code" :fieldHeader="true" required />
            </div>
  
            <div class="grid gap-1 w-full">
              <Label class="sr-only" for="mobile">Phone Number</Label>
              <UiInput id="mobile" v-model="mobile" v-bind="mobileAttrs" placeholder="Phone Number" type="tel"
                :disabled="isLoading" />
            </div>

          </div>
            <p v-if="errors.mobile" class="text-[#ef4444] text-[13px]">{{ errors.mobile }}</p>
        </div>

        <UiButton :disabled="isLoading" :loading="isLoading">
          <!-- <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" /> -->
          Proceed
        </UiButton>
      </div>
    </form>
  </div>
</template>
