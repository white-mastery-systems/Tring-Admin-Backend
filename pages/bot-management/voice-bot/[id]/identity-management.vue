<script setup lang="ts">
  import { label } from "@unovis/ts/components/axis/style";

  definePageMeta({
    middleware: "admin-only",
  });
  const route = useRoute("bot-management-voice-bot-id-identity-management");
  const botDetails: any = await getVoiceBotDetails(route.params.id);
  console.log(botDetails);
  const formSchema = toTypedSchema(
    z.object({
      name: z.string().min(1, "Name is required"),
      role: z.string().min(2, "Role must be provided."),
      domain: z.string().min(2, "Domain must be provided."),
    }),
  );
  const roles = [
    {
      value: "Customer Support",
      label: "Customer Support",
      helperText: "Assist customers with their questions and issues.",
    },
    {
      value: "Receptionist",
      label: "Receptionist",
      helperText: "Handles visitor interactions and phone calls.",
    },
  ];
  const domainList = [
    { value: "Customer Support", label:"Customer Support", },
    { value: "Sales Assistant", label:"Sales Assistant",  },
    { value: "Technical Support", label:"Technical Support", },
    { value: "Lead Generation", label:"Lead Generation", },
    {
      value: "Survey Taker",
      label:"Survey Taker", helperText: "Can contribute content but with limited permissions",
    },
    { value: "Appointment Scheduler", label:"Appointment Scheduler", },
    { value: "FAQ Bot", label:"FAQ Bot", },
    { value: "Others", label:"Others", },
  ];
  const isLoading = ref(false)

  const botSchema = toTypedSchema(
    z.object({
      name: z.string({ required_error: "Name is required" }).min(1, { message: "Name is required" }),
      role: z.string({ required_error: "Select A Role" }).min(1, { message: "Select A Role" }),
      domain: z.string({ required_error: "Select  A Domain" }).min(1, { message: "Select  A Domain" }),
      other: z.string().optional()
    }),
  );
  const { setFieldValue, handleSubmit, errors, defineField, resetForm, values } =
    useForm({
      validationSchema: botSchema,
      initialValues: {
        // name: "",
      },
    });


watchEffect(() => {
  if (botDetails) {
    const userName = botDetails?.name ?? 'Unknown Bot Name';
    useHead({
      title: `Voice Bot | ${userName} - Identity Management`,
    });
  }
});  
const onSubmit = handleSubmit(async (value: any) => {
    // updateLLMConfig()
    isLoading.value = true
    await updateLLMConfig({ identityManagement: value }, botDetails.id);
    isLoading.value = false
    return navigateTo({
      name: "bot-management-voice-bot-id",
      params: { id: botDetails.id },
    });
  });



if (botDetails.identityManagement) {
  setFieldValue("name", botDetails.identityManagement?.name);
  setFieldValue("role", botDetails.identityManagement?.role);
  setFieldValue("domain", botDetails.identityManagement?.domain);
  setFieldValue("other", botDetails.identityManagement?.other);
}



  const [name, nameFieldAttrs] = defineField("name");
  const [role, roleFieldAttrs] = defineField("role");
  const [domain, domainFieldAttrs] = defineField("domain");
  const [other, otherFieldAttrs] = defineField("other");




  const handleDomainSelection = (data:any)=>{
    console.log(data);
    
  }
</script>
<template>
  <!-- :bread-crumbs="[
    { label: `${botDetails.name}`, to: `/bot-management/chat-bot/${botDetails.id}` },
    {
      label: 'Intent Management',
      to: `/bot-management/chat-bot/${botDetails.id}/intent-management`,
    },
  ]"  -->
  <Page title="Bot Details" :bread-crumbs="[
      {
        label: `${botDetails.name}`,
        to: `/bot-management/voice-bot/${botDetails.id}`,
      },
      {
        label: 'Bot Details',
        to: `/bot-management/voice-bot/${botDetails.id}/identity-management`,
      },
    ]" :disableSelector="true" :disable-back-button="false" :disableElevation="false">
    <div>

      <form @submit="onSubmit" class="flex flex-col gap-2">
        <div class="flex grid grid-cols-2 gap-3">
          <span>
            <TextField name="name" label="Name" required placeholder="Enter name" />
          </span>
          <span>
            <SelectField name="role" label="Role" placeholder="Select a Role" :options="roles" required />
          </span>
        </div>
        <SelectField name="domain" label="Domain" placeholder="Select Domain" :options="domainList" required />
        <div v-if="values.domain === 'Others'">
          <TextField name="name" label="Other Domain Name" placeholder="Enter name" required>
          </TextField>
        </div>
        <div class="flex w-full justify-end">
          <UiButton type="submit" class="w-[120px] self-end bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110"
            size="lg">
            <template v-if="isLoading">
              <Icon name="svg-spinners:90-ring-with-bg" class="h-6 w-6 animate-spin text-white" />
            </template>
            <template v-else>
              Submit
            </template>
          </UiButton>
        </div>
      </form>
    </div>
  </Page>
</template>
