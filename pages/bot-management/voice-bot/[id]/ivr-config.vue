<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});

const animationProps = {
  duration: 500,
};
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(2, "Role must be provided."),
    domain: z.string().min(2, "Domain must be provided."),
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
  <Page title="IVR Configuration" :disableSelector="true" :disable-back-button="false" :disableElevation="false">
    <div>
      <UiForm :validation-schema="formSchema" :keep-values="true" :validate-on-mount="false" @submit="onSubmit"
        class="space-y-4">
        <div class="flex grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          <UiFormField v-slot="{ componentField }" name="provider">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold"> IVR Provider <UiLabel class="text-red-500 text-lg">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" type="text" placeholder="Enter Provider"
                  class="h-[50px] font-regular border-none bg-[#F6F6F6]" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
          <!-- <div class="flex gap-4 mb-4"> -->
          <UiFormField v-slot="{ componentField }" name="number">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold"> Number <UiLabel class="text-red-500 text-lg">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" type="text" placeholder="Enter Number"
                  class="h-[50px] font-regular border-none bg-[#F6F6F6]" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
        </div>
        <!-- </div> -->
        <UiButton type="submit" class="bg-[#424bd1] hover:bg-[#424bd1] self-end hover:brightness-110 w-[120px]"
          size="lg">Submit
        </UiButton>
      </UiForm>
    </div>
  </Page>
</template>
