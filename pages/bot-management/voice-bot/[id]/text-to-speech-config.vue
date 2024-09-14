<template>
  <Page title="Text To Speech Configurations">
    <form @submit="onSubmit">
    <div class="flex flex-col gap-2">
    <TextField name="firstName" label="First Name" helperText="enter your domain name" required placeHolder="Enter your first name"/>
    <SelectField
      name="crm"
      label="CRM"
      placeholder="Select CRM"
      helperText="Select your CRM provider."
      :options="[
        { value: 'sell-do', label: 'Sell Do',helperText:'sell do doesn\'t support text to speech' },
        { value: 'zoho-crm', label: 'Zoho CRM' },
        { value: 'zoho-bigin', label: 'Zoho Bigin' }
      ]"
      required
    />
    
    <UiButton color="primary" type="submit">Submit</UiButton>
    </div>
  </form>
  </Page>
</template>

<script setup>
import { useForm } from 'vee-validate';

const { handleSubmit ,setFieldValue} = useForm({
  validationSchema: toTypedSchema(z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
        crm: z.string({required_error:"Select your CRM provider."}).min(1,'Select your CRM provider.'),
  })),
});

const onSubmit = handleSubmit(values => {
    setFieldValue("passwordConfirm", values.password);
    setFieldValue("firstName", 'appu');
  alert(JSON.stringify(values, null, 2));
});
</script>
