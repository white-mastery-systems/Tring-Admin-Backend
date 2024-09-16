<template>
  <Page title="Text To Speech Configurations">
    <form @submit="onSubmit">
      <div class="flex flex-col gap-2">
        <TextField name="firstName" label="First Name" helperText="enter your domain name" required
          placeholder="Enter your first name" />
        <SelectField name="crm" label="CRM" placeholder="Select CRM" helperText="Select your CRM provider." :options="[
          { value: 'sell-do', label: 'Sell Do', helperText: 'sell do doesn\'t support text to speech' },
          { value: 'zoho-crm', label: 'Zoho CRM' },
          { value: 'zoho-bigin', label: 'Zoho Bigin' }
        ]" required />

        <CountryCodeField name="countryCode" label="Country Code" helperText="Enter your country code" required />
        <CountrySelectField name="country" label="country" helperText="Enter your country" required />
        <RegionSelectField name="state" label="state" helperText="select your state" required
          :country="values?.country" />
        <UiButton color="primary" type="submit">Submit</UiButton>
      </div>
    </form>
  </Page>
</template>

<script setup>
import { useForm } from 'vee-validate';

const { handleSubmit, setFieldValue, values } = useForm({
  initialValues: {
    multiple: []
  },
  validationSchema: toTypedSchema(z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    crm: z.string({ required_error: "Select your CRM provider." }).min(1, 'Select your CRM provider.'),
    countryCode: z.string({ required_error: "Enter your country code" }).min(1, 'Enter your country code'),
    country: z.string({ required_error: "Enter your country" }).min(1, 'Enter your country'),
    state: z.string({ required_error: "Select your state" }).min(1, 'Select your state'),
  })),
});

const onSubmit = handleSubmit(values => {
  setFieldValue("passwordConfirm", values.password);
  setFieldValue("firstName", 'appu');
  setFieldValue("crm", "zoho-crm");
  alert(JSON.stringify(values, null, 2));
});
</script>
