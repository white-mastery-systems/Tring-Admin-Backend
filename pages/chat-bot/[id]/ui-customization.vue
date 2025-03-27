<template>
  <page title="UI Customization" :bread-crumbs="[
    {
      label: `${botDetails.name}`,
      to: `/bot-management/chat-bot/${botDetails.id}`,
    },
    {
      label: 'UI Customization',
      to: `/bot-management/chat-bot/${botDetails.id}/ui-customization`,
    },
  ]" :disableSelector="true" :disable-back-button="false" :disable-elevation="false">
    <div>
      <form @submit.prevent="uiUpdate" class="space-y-6 pb-6">
        <div
          class="ml-0 flex w-full flex-col gap-[13px] p-5 sm:ml-0 sm:w-full md:ml-0 md:w-full lg:ml-11 lg:w-[60%] xl:ml-11 xl:w-[60%] overflow-scroll">
          <div class="w-[20%]">
            <FileUpload @change="handleLogoChange" name="logo" label="Upload Logo" :required="true" :accept="'image/*'"
              :url="values.logo.url" :fileType="'image'" :class="'h-24 cursor-pointer'"
              :helperText="'Only files up to 5MB can be uploaded.'" />
          </div>
          <!-- <UiFormField v-slot="{ handleChange, handleBlur, value }" name="logo">
            <UiFormItem class="flex w-full flex-col items-start">
              <UiLabel class="pb-2 text-lg font-medium">Logo</UiLabel>
              <div>
                {{ value }} || sadsad
                 <ImageUpload accept="image/*" @change="handleChange" @blur="handleBlur" :initial-file="value"
                  class="flex justify-start" />
              </div>
              <UiFormMessage />
              <span class="text-xs text-gray-500">Logo for chat bubble and avatar</span>
            </UiFormItem>
          </UiFormField> -->

          <div class="flex items-center gap-4">
            <UiFormField v-slot="{ componentField }" name="color">
              <UiFormItem class="w-full">
                <!-- <UiLabel class="text-lg font-medium">Color</UiLabel> -->
                <UiFormControl>
                  <div class="field_shadow flex h-14 items-center gap-8 rounded-lg bg-white px-5"
                    @click="openPrimaryColorPicker">
                    <div class="flex items-center w-full justify-between">
                      <label for="color"
                        class="py-auto content-center text-[10px] sm:text-[10px] md:text-[14px] lg:text-[14px] xl:text-[14px] font-medium">Primary
                        Color</label>
                      <div
                        class="h-5 w-5 sm:h-5 sm:w-5 md:h-8 md:w-8 lg:h-8 lg:w-8 xl:h-8 xl:w-8 overflow-hidden rounded-full">
                        <UiInput ref="colorInput" v-bind="componentField" type="color"
                          class="h-20 w-20 -translate-x-1/3 -translate-y-1/3" />
                      </div>
                    </div>
                  </div>
                </UiFormControl>
                <UiFormMessage />
                <span class="text-[7px] sm:text-[7px] md:text-xs lg:text-xs xl:text-xs text-gray-500">color used for
                  Messages,Widget Bubble</span>
              </UiFormItem>
            </UiFormField>
            <UiFormField v-slot="{ componentField }" name="secondaryColor">
              <UiFormItem class="w-full">
                <!-- <UiLabel class="text-lg font-medium">Color</UiLabel> -->
                <UiFormControl>
                  <div class="field_shadow flex h-14 items-center gap-8 rounded-lg bg-white px-5"
                    @click="openSecondaryColorPicker">
                    <div class="flex items-center gap-2 w-full justify-between">
                      <label for="color"
                        class="py-auto content-center text-[10px] sm:text-[10px] md:text-[14px] lg:text-[14px] xl:text-[14px] font-medium">Secondary
                        Color</label>
                      <div
                        class="h-5 w-5 sm:h-5 sm:w-5 md:h-8 md:w-8 lg:h-8 lg:w-8 xl:h-8 xl:w-8 overflow-hidden rounded-full">
                        <UiInput ref="secondarycolorInput" v-bind="componentField" type="color"
                          class="h-20 w-20 -translate-x-1/3 -translate-y-1/3" />
                      </div>
                    </div>
                  </div>
                </UiFormControl>
                <UiFormMessage />
                <span class="text-[7px] sm:text-[7px] md:text-xs lg:text-xs xl:text-xs text-gray-500">color used for
                  chat buttons</span>
              </UiFormItem>
            </UiFormField>
          </div>
          <div class="flex w-full items-center gap-3">
            <SelectField name="widgetSound" label="Widget Sound" placeholder="Select Widget Sound" :options="[
              {
                value: 'Yes',
                label: 'Yes',
              }, {
                value: 'No',
                label: 'No',
              },
            ]" required />
            <SelectField name="widgetPosition" label="Widget Position" placeholder="Select Widget Sound" :options="[
              {
                value: 'Left',
                label: 'Left',
              }, {
                value: 'Right',
                label: 'Right',
              },
            ]" required />
          </div>
          <div class="flex w-full items-center gap-5">
            <SelectField name="fontFamily" label="Font Famliy" placeholder="Select Font" :options="[
              {
                value: 'Kanit',
                label: 'Kanit',
              }, {
                value: 'Gilroy',
                label: 'Gilroy',
              }, {
                value: 'Jost',
                label: 'Jost',
              }, {
                value: 'Lexend deca',
                label: 'Lexend Deca',
              }, {
                value: 'Museo',
                label: 'Museo',
              }
            ]" required />
            <UiFormField v-slot="{ value, handleChange }" name="generateLead">
              <UiFormItem class="w-full">
                <div class="flex justify-between">
                  <UiLabel class="text-[14px] font-medium">
                    Generate Leads</UiLabel>
                  <UiFormControl>
                    <UiSwitch id="generateLead" :checked="value" @update:checked="handleChange"
                      :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                  </UiFormControl>
                  <UiFormMessage />
                </div>
                <span class="text-[7px] sm:text-[7px] md:text-xs lg:text-xs xl:text-xs text-gray-500">Show lead
                  generation form</span>
              </UiFormItem>
            </UiFormField>
          </div>
          <div class="flex w-full items-center gap-5">
            <UiFormField v-slot="{ value, handleChange }" name="defaultSelect">
              <UiFormItem class="w-full">
                <div class="flex justify-between">
                  <UiLabel class="text-[14px] font-medium">Open By
                    Default</UiLabel>
                  <UiFormControl>
                    <UiSwitch id="defaultSelect" :checked="value" @update:checked="handleChange"
                      :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                  </UiFormControl>
                  <UiFormMessage />
                </div>
                <span class="text-[7px] sm:text-[7px] md:text-xs lg:text-xs xl:text-xs text-gray-500">Open chat window
                  by default</span>
              </UiFormItem>
            </UiFormField>

            <UiFormField v-slot="{ value, handleChange }" name="onlineStatus">
              <UiFormItem class="w-full">
                <div class="flex items-center justify-between">
                  <UiLabel class="text-[14px] font-medium">Online
                    Status</UiLabel>
                  <UiFormControl>
                    <UiSwitch id="online-status" :checked="value" :style="{ background: value ? '#424BD1' : '#8A8A8A' }"
                      @update:checked="handleChange" />
                  </UiFormControl>
                  <UiFormMessage />
                </div>
                <span class="text-[7px] sm:text-[7px] md:text-xs lg:text-xs xl:text-xs text-gray-500">Live tag status of
                  chat window</span>
              </UiFormItem>
            </UiFormField>
          </div>
          <div class="flex w-full items-center gap-5">
            <UiFormField v-slot="{ value, handleChange }" name="defaultRibbon">
              <UiFormItem class="w-[49%]">
                <div class="flex justify-between">
                  <UiLabel class="text-[14px] font-medium">Open
                    Chat Ribbon</UiLabel>
                  <UiFormControl>
                    <UiSwitch id="defaultRibbon" :checked="value" @update:checked="handleChange"
                      :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                  </UiFormControl>
                  <UiFormMessage />
                </div>
                <span class="text-[7px] sm:text-[7px] md:text-xs lg:text-xs xl:text-xs text-gray-500">Open chat ribbon
                  by default</span>
              </UiFormItem>
            </UiFormField>

          </div>
          <FieldArray name="emailRecipients" v-slot="{ fields, push, remove }">
            <div v-if="fields.length" class="space-y-2">
              <!-- Loop through the fields (emailRecipients) -->
              <fieldset v-for="(email, index) in fields" :key="email.key">
                <div :class="['flex gap-2', ((values.emailRecipients[index]) ? 'items-end' : 'items-center')]">
                  <TextField :label="`Email`" :id="`email_config_${index}`" :name="`emailRecipients[${index}]`"
                    placeholder="Enter Email." required />
                  <!-- Button to remove the email -->
                  <span :class="['flex items-end', (values.emailRecipients[index]) ? '' : 'mt-3']">
                    <UiButton variant="outline" type="button" @click="remove(index)">
                      <CloseIcon class="w-4 h-4" />
                    </UiButton>
                  </span>
                </div>
              </fieldset>
            </div>

            <!-- Button to add a new email recipient -->
            <div class="flex flex-col w-full justify-end gap-2 mb-3">
              <span>
                <UiButton color="primary" type="submit" size="lg" @click="push('')">Add Email</UiButton>
              </span>
              <span class="text-[7px] sm:text-[7px] md:text-xs lg:text-xs xl:text-xs text-gray-500">
                Click to add more email recipients to be notified when a lead is submitted.
              </span>
            </div>
          </FieldArray>

          <div class="my-auto flex w-full justify-end py-2">
            <UiButton type="submit" color="primary" size="lg" :loading="isLoading">
              Submit
            </UiButton>
          </div>
        </div>
      </form>
    </div>
  </page>
  <!-- </div> -->
  <!-- <div class="pl-2 pr-10 pt-10">
      <UiLabel class="content-center items-center">Preview Widget</UiLabel>
    </div> -->
  <!-- </div> -->
</template>
<script setup lang="ts">
import { FieldArray } from "vee-validate";

definePageMeta({
  middleware: "admin-only",
});

// const logoAsObject = z.object({}).nonstrict();
// const logoAsString = z.string().min(1, "Logo is required");
const isLoading = ref(false)

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
const animationProps = {
  duration: 500,
};

const route = useRoute("chat-bot-id-ui-customization");
const router = useRouter();
const paramId: any = route;
const botDetails: any = await getBotDetails(paramId.params.id);
const colorInput: any = ref();
const secondarycolorInput: any = ref();
const logoData = ref("");

const {
  errors,
  setErrors,
  setFieldValue,
  handleSubmit,
  defineField,
  values,
  resetForm,
} = useForm({
  validationSchema: uiCustomizationValidation,
});

setFieldValue("logo", ((typeof botDetails.metadata.ui.logo === "object" ? botDetails.metadata.ui.logo : {url: botDetails.metadata.ui.logo}) ?? {}))

setFieldValue("color", (hslToHex(botDetails.metadata.ui.color ?? "236, 61%, 54%, 1")))

setFieldValue("secondaryColor", (hslToHex(
  botDetails.metadata.ui.secondaryColor ?? "236, 61%, 74%",
)))
setFieldValue("widgetSound", (botDetails.metadata.ui.widgetSound ?? "Yes"))
setFieldValue("widgetPosition", (botDetails.metadata.ui.widgetPosition ?? "Left"))
setFieldValue("fontFamily", (botDetails.metadata?.ui.fontFamily ?? "Kanit"))
setFieldValue("defaultSelect", (botDetails.metadata.ui.defaultSelect ?? true))
setFieldValue("onlineStatus", (botDetails.metadata.ui.onlineStatus ?? true))
setFieldValue("generateLead", (botDetails.metadata.ui.generateLead ?? true))
setFieldValue("defaultRibbon", (botDetails.metadata.ui.defaultRibbon ?? true))
setFieldValue("emailRecipients", (botDetails.emailRecipients ?? []))

watch(
  () => botDetails?.name, // Watching only the 'name' property
  (newName) => {
    const userName = newName ?? "Unknown Bot Name";
    useHead({
      title: `Chat Bot | ${userName} - UI Customization`,
    });
  },
  { immediate: true } // Runs immediately when botDetails is available
);
const handleLogoChange = async (event: any) => {
  logoData.value = event[0];

  const reader = new FileReader();
  reader.onload = (e) => {
    setFieldValue("logo", { url: e.target.result });
  };
  reader.readAsDataURL(logoData.value);
};

const uiUpdate = handleSubmit(async (value: any) => {
  let uploadedDetails = null;

  if (typeof logoData.value === "object") {
    uploadedDetails = await uploadLogo(botDetails.id, logoData.value);
  }
  isLoading.value = true
  const payload: any = {
    id: botDetails.id,
    emailRecipients: value.emailRecipients,
    metadata: {
      ...botDetails.metadata,
      ui: {
        logo: uploadedDetails?.metadata?.ui?.logo ?? botDetails.metadata.ui?.logo,
        color: hexToHSL(value.color),
        secondaryColor: hexToHSL(value.secondaryColor),
        defaultSelect: value.defaultSelect,
        onlineStatus: value.onlineStatus,
        widgetPosition: value.widgetPosition,
        widgetSound: value.widgetSound,
        fontFamily: value.fontFamily,
        generateLead: value.generateLead,
        defaultRibbon: value.defaultRibbon,
      },
      prompt: {
        ...botDetails.metadata.prompt,
        INTENTS: value.generateLead ? "-details\n-other" : "-other",
      },
    },
  };
  await updateBotDetails(payload,true);
  isLoading.value = false
  return navigateTo({
    name: "chat-bot-id",
    params: { id: paramId.params.id },
  });
});
const openPrimaryColorPicker = () => {
  colorInput.value.$el.click()
}
const openSecondaryColorPicker = () => {
  secondarycolorInput.value.$el.click()
}
</script>