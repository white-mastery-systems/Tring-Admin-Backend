<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});

const animationProps = {
  duration: 500,
};
const formSchema = toTypedSchema(
  z.object({
    provider: z.string().min(1, 'Name is required'),
    number: z.number().min(2, "Number must be provided."),
  })
)
const roles = ['Customer Support', 'Receptionist']
const domainList = ['Admin', 'User', 'Editor', 'Viewer', 'Contributor', 'Manager'];
const onSubmit = async (value: any) => {
  console.log(value, "value")
};
</script>
<template>
  <!-- :bread-crumbs="[
    { label: `${botDetails.name}`, to: `/bot-management/chat-bot/${botDetails.id}` },
    {
      label: 'Intent Management',
      to: `/bot-management/chat-bot/${botDetails.id}/intent-management`,
    },
  ]"  -->
  <Page title="Identity Management" :disableSelector="true" :disable-back-button="false" :disableElevation="false">
    <div>
      <UiForm :validation-schema="formSchema" :keep-values="true" :validate-on-mount="false" @submit="onSubmit"
        class="space-y-4">
        <div class="flex grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          <UiFormField v-slot="{ componentField }" name="name">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold"> Name <UiLabel class="text-red-500 text-lg">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" type="text" placeholder="Enter Name"
                  class="h-[50px] font-regular border-none bg-[#F6F6F6]" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
          <!-- <div class="flex gap-4 mb-4"> -->
          <UiFormField v-slot="{ componentField }" name="role">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold">Role <UiLabel class="text-red-500 text-lg">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiSelect v-bind="componentField">
                  <UiSelectTrigger class="h-[50px] border-0 bg-[#FFFFFF] field_shadow">
                    <UiSelectValue placeholder="Select Role" class="font-medium" />
                  </UiSelectTrigger>
                  <UiSelectContent>
                    <UiSelectItem v-for="(role, index) in roles" :value="role">{{
                      role
                      }}</UiSelectItem>
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
        <UiFormField v-slot="{ componentField }" name="domain">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel class="font-bold">Domain <UiLabel class="text-red-500 text-lg">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField" multiple>
                <UiSelectTrigger class="h-[50px] border-0 bg-[#FFFFFF] field_shadow">
                  <UiSelectValue placeholder="Select Domain" class="font-medium" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem v-for="(domain, index) in domainList" :value="domain">{{
                    domain
                    }}</UiSelectItem>
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
        <!-- </div> -->
         <div class="flex justify-end w-full">
           <UiButton type="submit" class="bg-[#424bd1] hover:bg-[#424bd1] self-end hover:brightness-110 w-[120px]"
             size="lg">Submit
           </UiButton>
         </div>
      </UiForm>
    </div>
  </Page>
</template>
