<template>
  <page title="UI Customization" :description="false" :disableSelector="true" :disable-back-button="false">
    <div>
      <UiForm :validation-schema="formSchema" :keep-values="true" :initial-values="defaultFormValues"
        :validate-on-mount="false" @submit="uiUpdate" class="space-y-5">

        <div
          class="form-align flex flex-col p-5 w-full sm:w-full md:w-full lg:w-[60%] xl:w-[60%] overflow-y-auto gap-[13px] field_shadow ml-0 sm:ml-0 md:ml-0 lg:ml-11 xl:ml-11">
          <UiFormField v-slot="{ value, componentField }" name="logo">
            <UiFormItem v-auto-animate="animationProps" class="w-full flex flex-col items-start">
              <UiLabel class="pb-2 text-lg font-medium">Logo</UiLabel>
              <div>
                <ImageUpload accept="image/*" v-bind="componentField" class="flex justify-start" />
              </div>
              <!-- <UiFormControl>
              </UiFormControl> -->
              <UiFormMessage />
              <span class="text-xs text-gray-500">Logo for chat bubble and avatar</span>
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ componentField }" name="color">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiLabel class="text-lg font-medium">Colour</UiLabel>
              <UiFormControl>
                <div class="flex items-center field_shadow bg-[#ffffff] h-14 gap-8 rounded-lg bg-white px-5">
                  <div class="w-full flex justify-between">
                    <label for="color" class="py-auto content-center text-base font-medium">Primary Colour</label>
                    <div class="h-8 w-8 overflow-hidden rounded-full">
                      <UiInput v-bind="componentField" type="color"
                        class="h-20 w-20 -translate-x-1/3 -translate-y-1/3" />
                      <!-- <input v-bind="componentField" type="color" id="colorId" name="color"
                        class="h-20 w-20 -translate-x-1/3 -translate-y-1/3" /> -->
                    </div>
                  </div>
                </div>
              </UiFormControl>
              <UiFormMessage />
              <span class="text-xs text-gray-500">Select color for chat window</span>
            </UiFormItem>
          </UiFormField>
          <div class="flex items-center justify-between w-full">
            <div class="w-[50%]">
              <UiFormField v-slot="{ componentField }" name="widgetSound">
                <UiFormItem v-auto-animate="animationProps">
                  <UiLabel class="text-lg font-medium">Widget Sound</UiLabel>
                  <UiFormControl>
                    <UiSelect v-bind="componentField">
                      <UiSelectTrigger
                        class="hover:focus:none hover:focus-visible:none field_shadow bg-[#ffffff] h-12 w-[60%]">
                        <UiSelectValue placeholder="Select Widget Sound" />
                      </UiSelectTrigger>
                      <UiSelectContent>
                        <UiSelectItem value="Yes"> Yes </UiSelectItem>
                        <UiSelectItem value="No"> No </UiSelectItem>
                      </UiSelectContent>
                    </UiSelect>
                  </UiFormControl>
                  <UiFormMessage />
                  <span class="text-[8px] sm:text-[6px] md:text-[8px] lg:text-xs xl:text-xs text-gray-500">Notification
                    sound for chat window</span>
                </UiFormItem>
              </UiFormField>
            </div>
            <div class="w-[50%]">
              <UiFormField v-slot="{ componentField }" name="widgetPosition">
                <UiFormItem v-auto-animate="animationProps" class="flex flex-col items-end justify-center">
                  <UiLabel class="text-lg font-medium">Widget Position</UiLabel>
                  <UiFormControl>
                    <UiSelect v-bind="componentField">
                      <UiSelectTrigger
                        class="hover:focus-visible:none hover:focus:none field_shadow bg-[#ffffff] h-12 w-[60%]">
                        <UiSelectValue placeholder="Select Widget Position" />
                      </UiSelectTrigger>
                      <UiSelectContent>
                        <UiSelectItem value="Left"> Left </UiSelectItem>
                        <UiSelectItem value="Right"> Right </UiSelectItem>
                      </UiSelectContent>
                    </UiSelect>
                  </UiFormControl>
                  <UiFormMessage />
                  <span class="text-[10px] sm:text-[6px] md:text-[8px] lg:text-xs xl:text-xs text-gray-500">Position for
                    chat
                    bubble</span>
                </UiFormItem>
              </UiFormField>
            </div>
          </div>

          <UiFormField v-slot="{ value, handleChange }" name="defaultSelect">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <div class="flex justify-between">
                <UiLabel class="text-base font-medium">Open By Default</UiLabel>
                <UiFormControl>
                  <UiSwitch id="defaultSelect" :checked="value" @update:checked="handleChange"
                    :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                </UiFormControl>
                <UiFormMessage />
              </div>
              <span class="text-xs text-gray-500">Open chat window by default</span>
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ value, handleChange }" name="generateLead">
            <UiFormItem v-auto-animate="animationProps" class="w-full flex items-center justify-between">
              <!-- <div class="flex items-center justify-between"> -->
              <UiLabel class="text-base font-medium">Generate Leads</UiLabel>
              <UiFormControl>
                <UiSwitch id="generateLead" :checked="value" @update:checked="handleChange"
                  :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
              </UiFormControl>
              <!-- </div> -->
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ value, handleChange }" name="onlineStatus">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <div class="flex items-center justify-between">
                <UiLabel class="text-base font-medium">Online Status</UiLabel>
                <UiFormControl>
                  <UiSwitch id="online-status" :checked="value" :style="{ background: value ? '#424BD1' : '#8A8A8A' }"
                    @update:checked="handleChange" />
                </UiFormControl>
                <UiFormMessage />
              </div>
              <span class="text-xs text-gray-500">Live tag status of chat window</span>
            </UiFormItem>
          </UiFormField>

          <div class="flex justify-center w-full my-auto">
            <UiButton type="submit"
              class="my-auto text-base font-semibold w-[40%] h-[40px] rounded-[10px] bg-[#424bd1] hover:bg-[#424bd1] text-[#ffffff]">
              Submit
            </UiButton>
          </div>
        </div>
      </UiForm>
    </div>
  </page>
  <!-- </div> -->
  <!-- <div class="pl-2 pr-10 pt-10">
      <UiLabel class="content-center items-center">Preview Widget</UiLabel>
    </div> -->
  <!-- </div> -->
</template>
<script setup lang="ts">
import { useForm } from 'vee-validate'
definePageMeta({
  middleware: "admin-only",
});

const logoAsObject = z.object({}).nonstrict()
const logoAsString = z.string().min(1, 'Logo is required')

const formSchema = toTypedSchema(
  z.object({
    logo: z.union([logoAsString, logoAsObject]),
    color: z.string().min(1, 'Primary color is required'),
    widgetSound: z.string().min(1, 'Widget sound must be selected'),
    widgetPosition: z.string().min(1, 'Widget position must be selected'),
    defaultSelect: z.boolean().optional(),
    generateLead: z.boolean().optional(),
    onlineStatus: z.boolean().optional(),
  })
);
const animationProps = {
  duration: 500,
};


const route = useRoute();
const router = useRouter();
const paramId: any = route;
const botDetails: any = await getBotDetails(paramId.params.id);
const defaultFormValues = reactive({
  logo: botDetails.metadata.ui.logo ?? '',
  color: hslToHex(botDetails.metadata.ui.color ?? '236, 61%, 54%, 1'),
  defaultSelect: botDetails.metadata.ui.defaultSelect ?? true,
  widgetSound: botDetails.metadata.ui.widgetSound ?? 'Yes',
  widgetPosition: botDetails.metadata.ui.widgetPosition ?? 'Left',
  onlineStatus: botDetails.metadata.ui.onlineStatus ?? false,
  generateLead: (botDetails.metadata.prompt.INTENTS !== "-other"),
})
// const { handleSubmit }: any = useForm({
//   validationSchema: formSchema,
//   initialValues: defaultFormValues,
// })

const uiUpdate = async (value: any) => {
  // const ges: any = JSON.stringify(values, null, 7)
  // console.log(ges, "value -- value");
  const payload: any = {
    // name: botDetails.name,
    id: botDetails.id,
    metadata: {
      ...botDetails.metadata,
      ui: {
        logo: value.logo,
        color: hexToHSL(value.color),
        defaultSelect: value.defaultSelect,
        onlineStatus: value.onlineStatus,
        widgetPosition: value.widgetPosition,
        widgetSound: value.widgetSound,
      },
      prompt: {
        ...botDetails.metadata.prompt,
        INTENTS: value.generateLead ? "-details\n-other" : "-other",
      },
    },
  };
  await updateBotDetails(payload);

  value.logo && (await uploadLogo(botDetails.id, value.logo![0]));

  return navigateTo({
    name: "bots-id",
    params: { id: paramId.params.id },
  });
  // console.log(botDetails.name, "botDetails.name")
  // console.log(pickColor.value, "pickColor.value")
  // console.log(defualtSelect.value, "pickColor.value")
} 
</script>
<style scoped>
.form-align {
  height: calc(100vh - 120px);
}
</style>
