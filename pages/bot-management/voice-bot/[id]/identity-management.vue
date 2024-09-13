<script setup lang="ts">
  import { label } from "@unovis/ts/components/axis/style";

  definePageMeta({
    middleware: "admin-only",
  });

  const animationProps = {
    duration: 500,
  };
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
      content: "Customer Support",
      label: "Assist customers with their questions and issues.",
    },
    {
      content: "Receptionist",
      label: "Handles visitor interactions and phone calls.",
    },
  ];
  const domainList = [
    { content: "Admin", label: "Manages system settings and user permissions" },
    { content: "User", label: "Regular user with access to basic features" },
    { content: "Editor", label: "Can edit and manage content" },
    { content: "Viewer", label: "Can view content but cannot make changes" },
    {
      content: "Contributor",
      label: "Can contribute content but with limited permissions",
    },
    { content: "Manager", label: "Oversees team and project management" },
    { content: "Others", label: "Other" },
  ];

  const onSubmit = async (value: any) => {
    // updateLLMConfig()
    await updateLLMConfig({ identityManagement: value }, botDetails.id);
    return navigateTo({
      name: "bot-management-voice-bot-id",
      params: { id: botDetails.id },
    });
  };

  const botSchema = toTypedSchema(
    z.object({
      name: z.string().min(1, { message: "Name is required" }),
      role: z.string().min(1, { message: "Select A Role" }),
      domain: z.string().min(1, { message: "Select  A Domain" }),
      other: z.string().optional()
    }),
  );

  const { setFieldValue, handleSubmit, errors, defineField, resetForm,getField } =
    useForm({
      validationSchema: botSchema,
      initialValues: {
        name: "",
      },
    });

  setFieldValue("name", botDetails.identityManagement.name);
  setFieldValue("role", botDetails.identityManagement.role);
  setFieldValue("domain", botDetails.identityManagement.domain);
  setFieldValue("other", botDetails.identityManagement.other);



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
  <Page
    title="Bot Details"
    :bread-crumbs="[
      {
        label: `${botDetails.name}`,
        to: `/bot-management/voice-bot/${botDetails.id}`,
      },
      {
        label: 'Bot Details',
        to: `/bot-management/voice-bot/${botDetails.id}/identity-management`,
      },
    ]"
    :disableSelector="true"
    :disable-back-button="false"
    :disableElevation="false"
  >
    <div>
      <UiForm
        :keep-values="true"
        :validate-on-mount="false"
        @submit="onSubmit"
        class="space-y-4"
      >
        <div
          class="flex grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
        >
          <UiFormField
            v-slot="{ componentField }"
            v-model="name"
            v-bind="nameFieldAttrs"
            name="name"
          >
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold">
                Name <UiLabel class="text-lg text-red-500">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput
                  v-bind="componentField"
                  type="text"
                  placeholder="Enter Name"
                  class="font-regular h-10"
                />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
          <!-- <div class="flex gap-4 mb-4"> -->
          <UiFormField
            v-slot="{ componentField }"
            v-model="role"
            v-bind="roleFieldAttrs"
            name="role"
          >
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold"
                >Role <UiLabel class="text-lg text-red-500">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiSelect v-bind="componentField">
                  <UiSelectTrigger class="h-10">
                    <UiSelectValue
                      placeholder="Select Role"
                      class="font-medium"
                    />
                  </UiSelectTrigger>
                  <UiSelectContent>
                    <div v-for="(role, index) in roles">
                      <UiSelectItem :value="role.content">{{
                        role.content
                      }}</UiSelectItem>
                      <span class="mx-2 text-xs italic text-gray-500">{{
                        role.label
                      }}</span>
                    </div>
                  </UiSelectContent>
                </UiSelect>
                <!-- <UiFormField v-if="componentField.modelValue === 'Other'" v-slot="{ componentField }" name="otherRole">
                  <UiFormItem v-auto-animate="animationProps" class="w-full">
                    <UiFormControl>
                      <UiInput v-bind="componentField" type="text" class="h-[50px]" />
                    </UiFormControl>
                    <UiFormMessage />
                  </UiFormItem>
                </UiFormField> -->
              </UiFormControl>
              <UiFormMessage />
              <!-- <span class="text-xs text-gray-500">This will determine the role of the bot and behavior.</span> -->
            </UiFormItem>
          </UiFormField>
        </div>
        <UiFormField
          v-slot="{ componentField }"
          v-model="domain"
          v-bind="domainFieldAttrs"
          name="domain"
        >
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel class="font-bold"
              >Domain <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField" multiple >
                <UiSelectTrigger class="h-10">
                  <UiSelectValue
                    placeholder="Select Domain"
                    class="font-medium"
                  />
                </UiSelectTrigger>
                <UiSelectContent>
                  <div v-for="(domain, index) in domainList">
                    <UiSelectItem :value="domain.content">{{
                      domain.content
                    }}</UiSelectItem>
                    <span class="mx-2 text-xs italic text-gray-500">{{
                      domain.label
                    }}</span>
                  </div>
                </UiSelectContent>
              </UiSelect>
              <!-- <UiFormField v-if="componentField.modelValue === 'Other'" v-slot="{ componentField }" name="otherRole">
                <UiFormItem v-auto-animate="animationProps" class="w-full">
                  <UiFormControl>
                    <UiInput v-bind="componentField" type="text" class="h-[50px]" />
                  </UiFormControl>
                  <UiFormMessage />
                </UiFormItem>
              </UiFormField> -->
            </UiFormControl>
            <UiFormMessage />
            <!-- <span class="text-xs text-gray-500">This will determine the role of the bot and behavior.</span> -->
          </UiFormItem>
        </UiFormField>

           <UiFormField
            v-slot="{ componentField }"
            v-model="other"
            v-bind="otherFieldAttrs"
            name="other"
          > 

            <UiFormItem v-if="domain === 'Others' " v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold">
               Other Domain Name   <UiLabel class="text-lg text-red-500"></UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput
                  v-bind="componentField"
                  type="text"
                  placeholder="Enter Name"
                  class="font-regular h-10"
                />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
        <!-- </div> -->
        <div class="flex w-full justify-end">
          <UiButton
            type="submit"
            class="w-[120px] self-end bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110"
            size="lg"
            >Submit
          </UiButton>
        </div>
      </UiForm>
    </div>
  </Page>
</template>
