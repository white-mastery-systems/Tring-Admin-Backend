<template>
  <div>
    <form @submit.prevent="uiUpdate" class="space-y-6">
       <div class="flex w-full flex-col gap-[13px] py-4 overflow-scroll">

        <!-- File Upload for Logo -->
        <!-- <div class="w-[20%]">
          <FileUpload @change="handleLogoChange" name="logo" label="Upload Logo" :required="true" :accept="'image/*'"
            :url="values?.logo.url" :fileType="'image'" :class="'h-24 cursor-pointer'"
            :helperText="'Only files up to 5MB can be uploaded.'" />
        </div> -->

        <!-- Primary and Secondary Color Pickers -->
        <!-- <div class="flex grid grid-cols-3 items-center gap-4 w-full gap-5"> -->
        <div class="w-full rounded-lg">
          <UiFileUpload @change="handleLogoChange" name="logo" label="Upload your logo here" :required="true"
            :accept="'image/*'" :url="values?.logo.url" :fileType="'image'" :class="'h-24 cursor-pointer'"
            :helperText="'Only files up to 5MB can be uploaded.'" />
        </div>
        <!-- </div> -->
        <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 items-center gap-4 w-full gap-5">
          <UiFormField v-slot="{ componentField }" name="color">
            <UiFormItem>
              <UiFormControl>
                <div
                  class="flex items-center gap-8 rounded-lg bg-white p-5 border-[1px] border-solid border-[#E4E4E7] rounded-lg"
                  @click="openPrimaryColorPicker">
                  <div class="flex items-center w-full justify-between">
                    <div>
                      <label class="text-[16px] font-medium"> Primary Color</label>
                      <div class="text-[#71717A] text-[12px]">Colors for widget & chat button</div>
                    </div>
                    <div class="h-9 w-9 overflow-hidden rounded-full">
                      <UiInput ref="colorInput" v-bind="componentField" type="color"
                        class="h-20 w-20 -translate-x-1/3 -translate-y-1/3" />
                    </div>
                  </div>
                </div>
              </UiFormControl>
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ componentField }" name="secondaryColor" class="box_shadow">
            <UiFormItem class="w-full">
              <UiFormControl>
                <div
                  class="flex items-center gap-8 rounded-lg bg-white p-5 border-[1px] border-solid border-[#E4E4E7] rounded-lg"
                  @click="openSecondaryColorPicker">
                  <div class="flex items-center w-full justify-between">
                    <div>
                      <label class="text-[16px] font-medium">Secondary Color</label>
                      <div class="text-[#71717A] text-[12px]">Colors for messages</div>
                    </div>
                    <div class="h-9 w-9 overflow-hidden rounded-full">
                      <UiInput ref="secondarycolorInput" v-bind="componentField" type="color"
                        class="h-20 w-20 -translate-x-1/3 -translate-y-1/3" />
                    </div>
                  </div>
                </div>
              </UiFormControl>
            </UiFormItem>
          </UiFormField>
        </div>
        <!-- Widget Sound and Position -->
        <div class="flex w-full items-center gap-3">
          <!-- <SelectField name="widgetSound" label="Widget Sound" placeholder="Select Widget Sound" :options="[
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
          ]" required /> -->

          <SelectField name="widgetPosition" label="Widget Position" placeholder="Select Widget Position" :options="[
            { value: 'Left', label: 'Left' },
            { value: 'Right', label: 'Right' },
          ]" required />
        </div>

        <!-- Font Family -->
        <SelectField name="fontFamily" label="Font Family" placeholder="Select Font" :options="[
          { value: 'Kanit', label: 'Kanit' },
          { value: 'Gilroy', label: 'Gilroy' },
          { value: 'Jost', label: 'Jost' },
          { value: 'Lexend Deca', label: 'Lexend Deca' },
          { value: 'Museo', label: 'Museo' }
        ]" required />
        <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 w-full items-center gap-5">
          <UiFormField v-slot="{ value, handleChange }" name="generateLead">
            <UiFormItem class="flex justify-between w-full border-[1px] border-solid border-[#E4E4E7] p-4 rounded-lg">
              <div class="flex flex-col gap-2 w-full">
                <UiLabel class="text-[14px] font-medium">
                  Generate Leads</UiLabel>
                <UiFormMessage />
                <span class="text-[7px] sm:text-[7px] md:text-xs lg:text-xs xl:text-xs text-gray-500">Show lead
                  generation form</span>
              </div>
              <UiFormControl>
                <UiSwitch id="generateLead" :checked="value" @update:checked="handleChange"
                  :style="{ background: value ? '#0F172A' : '#8A8A8A' }" />
              </UiFormControl>
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ value, handleChange }" name="defaultSelect">
            <UiFormItem class="w-full flex justify-between border-[1px] border-solid border-[#E4E4E7] p-4 rounded-lg">
              <div class="flex flex-col gap-2">
                <UiLabel class="text-[14px] font-medium">Open By
                  Default</UiLabel>
                <UiFormControl>
                  <span class="text-[7px] sm:text-[7px] md:text-xs lg:text-xs xl:text-xs text-gray-500">Open chat
                    window
                    by default</span>
                </UiFormControl>
                <UiFormMessage />
              </div>
              <UiSwitch id="defaultSelect" :checked="value" @update:checked="handleChange"
                :style="{ background: value ? '#0F172A' : '#8A8A8A' }" />
            </UiFormItem>
          </UiFormField>

        </div>
        <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 w-full items-center gap-5">
          <UiFormField v-slot="{ value, handleChange }" name="defaultRibbon">
            <UiFormItem
              class="flex justify-between w-full p-4 rounded-lg border-[1px] border-solid border-[#E4E4E7] rounded-lg">
              <div class="flex flex-col gap-2 w-full">
                <UiLabel class="text-[14px] font-medium">Open
                  Chat Ribbon</UiLabel>
                <UiFormMessage />
                <span class="text-[7px] sm:text-[7px] md:text-xs lg:text-xs xl:text-xs text-gray-500">Open chat ribbon
                  by default</span>
              </div>
              <UiFormControl>
                <UiSwitch id="defaultRibbon" :checked="value" @update:checked="handleChange"
                  :style="{ background: value ? '#0F172A' : '#8A8A8A' }" />
              </UiFormControl>
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ value, handleChange }" name="onlineStatus">
            <UiFormItem
              class="flex justify-between w-full border-[1px] border-solid border-[#E4E4E7] rounded-lg p-4 rounded-lg">
              <div class="flex flex-col gap-2 w-full">
                <UiLabel class="text-[14px] font-medium">Online
                  Status</UiLabel>
                <UiFormControl>
                  <span class="text-[7px] sm:text-[7px] md:text-xs lg:text-xs xl:text-xs text-gray-500">Live tag
                    status
                    of
                    chat window</span>
                </UiFormControl>
                <UiFormMessage />
              </div>
              <UiSwitch id="online-status" :checked="value" :style="{ background: value ? '#0F172A' : '#8A8A8A' }"
                @update:checked="handleChange" />
            </UiFormItem>
          </UiFormField>
          <UiFormField v-slot="{ value, handleChange }" name="widgetSound">
            <UiFormItem
              class="flex justify-between w-full border-[1px] border-solid border-[#E4E4E7] rounded-lg p-4 rounded-lg">
              <div class="flex flex-col gap-2 w-full">
                <UiLabel class="text-[14px] font-medium"> Widget Sound </UiLabel>
                <UiFormControl>
                  <span class="text-[7px] sm:text-[7px] md:text-xs lg:text-xs xl:text-xs text-gray-500">Do you want
                    enable sounds for chat widget</span>
                </UiFormControl>
                <UiFormMessage />
              </div>
              <UiSwitch id="online-status" :checked="value" :style="{ background: value ? '#0F172A' : '#8A8A8A' }"
                @update:checked="handleChange" />
            </UiFormItem>
          </UiFormField>
        </div>
        <div class="flex w-full items-center gap-5">

        </div>
        <!-- Email Recipients -->
        <!-- <FieldArray name="emailRecipients" v-slot="{ fields, push, remove }">
          <div v-if="fields.length" class="space-y-2">
            <fieldset v-for="(email, index) in fields" :key="email.key">
              <div class="flex gap-2">
                <TextField :label="'Email'" :id="`email_config_${index}`" :name="`emailRecipients[${index}]`"
                  placeholder="Enter Email." required />
                <UiButton variant="outline" type="button" @click="remove(index)">
                  <CloseIcon class="w-4 h-4" />
                </UiButton>
              </div>
            </fieldset>
          </div>
          <UiButton type="button" @click="push('')">Add Email</UiButton>
        </FieldArray> -->

        <!-- Submit Button -->
        <div class="my-auto flex w-full justify-end py-2">
          <UiButton type="submit" size="lg" :loading="isLoading">Submit</UiButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { FieldArray } from "vee-validate";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "nuxt/app";
// import { useBotStore } from '~/store/botStore';
import { botStore } from '~/store/botStore';

const isLoading = ref(false);
const colorInput: any = ref();
const secondarycolorInput: any = ref();
const logoData: any = ref("");
const route = useRoute();
const useStoreBotDetails = botStore();
// const { scrapedData } = useBotStore();

const logoAsString = z.string().min(1, "Logo is required");
const logoAsObject = z.object({
  url: z.string({ required_error: "Logo is required" }).min(1, "Logo is required"),
});
const uiCustomizationValidation = toTypedSchema(
  z.object({
    logo: z.union([logoAsString, logoAsObject]),
    color: z.string().min(1, "Primary color is required"),
    secondaryColor: z.string().min(1, "Secondary color is required"),
    widgetSound: z.string({ required_error: "Widget sound must be selected" }).min(1, "Widget sound must be selected"),
    widgetPosition: z.string({ required_error: "Widget position must be selected" }).min(1, "Widget position must be selected"),
    fontFamily: z.string({ required_error: "Font family is required" }).min(1, "Font family is required"),
    emailRecipients: z.array(z.string().email()),
    defaultSelect: z.boolean().optional(),
    generateLead: z.boolean().optional(),
    onlineStatus: z.boolean().optional(),
    defaultRibbon: z.boolean().optional(),
  }),
);

const {
  errors,
  setFieldValue,
  handleSubmit,
  values,
} = useForm({ validationSchema: uiCustomizationValidation });

const paramId = route.params.id;
const botDetails = await getBotDetails(paramId);
setFieldValue("logo", botDetails.metadata.ui.logo ?? {});
setFieldValue("color", hslToHex(botDetails.metadata.ui.color ?? "236, 61%, 54%, 1"));
setFieldValue("secondaryColor", hslToHex(botDetails.metadata.ui.secondaryColor ?? "236, 61%, 74%"));
setFieldValue("widgetSound", botDetails.metadata.ui.widgetSound ?? "Yes");
setFieldValue("widgetPosition", botDetails.metadata.ui.widgetPosition ?? "Left");
setFieldValue("fontFamily", botDetails.metadata.ui.fontFamily ?? "Kanit");
setFieldValue("emailRecipients", botDetails.emailRecipients ?? []);


watch(() => useStoreBotDetails, (newValue) => {
  const extractHSLValues = (hslString: string) => hslString.replace(/hsl\(|\)/g, "");
  setFieldValue("logo", { url: newValue.scrapedData?.brand?.logo_url } ?? {});
  setFieldValue("color", hslToHex(extractHSLValues(newValue.scrapedData?.chatbot?.primary_color) ?? "236, 61%, 54%, 1"));
  setFieldValue("secondaryColor", hslToHex(extractHSLValues(newValue.scrapedData?.chatbot?.secondary_color) ??"236, 61%, 74%"));
  console.log(newValue.scrapedData, "scrapData -- scrapData");
}, { deep: true });
const handleLogoChange = async (event: any) => {
  logoData.value = event[0];
  const reader = new FileReader();
  reader.onload = (e) => setFieldValue("logo", { url: e.target.result });
  reader.readAsDataURL(logoData.value);
};

const uiUpdate = handleSubmit(async (value) => {
  let uploadedDetails = null;
  if (typeof logoData.value === "object") {
    uploadedDetails = await uploadLogo(botDetails.id, logoData.value);
  }

  isLoading.value = true;
  const payload = {
    id: botDetails.id,
    emailRecipients: value.emailRecipients,
    metadata: {
      ...botDetails.metadata,
      ui: {
        logo: uploadedDetails?.metadata?.ui?.logo ?? botDetails.metadata.ui.logo,
        color: hexToHSL(value.color),
        secondaryColor: hexToHSL(value.secondaryColor),
        widgetPosition: value.widgetPosition,
        widgetSound: value.widgetSound,
        fontFamily: value.fontFamily,
      },
    },
  };
  await updateBotDetails(payload);
  isLoading.value = false;
});

const openPrimaryColorPicker = () => colorInput.value.$el.click();
const openSecondaryColorPicker = () => secondarycolorInput.value.$el.click();
</script>
