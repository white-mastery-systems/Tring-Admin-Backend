<script setup lang="ts">
import { useField } from "vee-validate";
import { ref } from "vue";

const props = defineProps<{
  errors: Record<string, any>;
  values: Record<string, any>;
}>();
const emit = defineEmits(['update:values', 'changeLogo']);
// ✅ Use `useField()` from vee-validate
const { value: COMPANY } = useField("COMPANY");
const { value: NAME } = useField("NAME");
const { value: color } = useField("color");
const { value: secondaryColor, } = useField("secondaryColor");
const { value: selectedType } = useField("type");
const { value: logo } = useField("logo");
const { value: BotName } = useField("BotName");
const colorInput = ref();
const secondarycolorInput = ref();
const logoData = ref()


const openPrimaryColorPicker = () => colorInput.value.$el.click();
const openSecondaryColorPicker = () => secondarycolorInput.value.$el.click();

const handleLogoChange = (event: any) => {
  // Get the file from the event
  logoData.value = event[0];

  if (logoData.value) {
    const reader = new FileReader();

    reader.onload = (e) => {
      // Update the field value with the data URL
      logo.value = { url: e.target.result };
      // Emit the changeLogo event to the parent component
      emit('changeLogo', {
        file: logoData.value,
      });
      emit('update:values', {
        NAME: NAME.value,
        COMPANY: COMPANY.value,
        type: selectedType.value,
        file: logoData.value,
        logo: logo.value,
        secondaryColor: secondaryColor.value,
        color: color.value,
        BotName: BotName.value,
      });
    };

    reader.readAsDataURL(logoData.value);
  }
};
const inputFieldEnterPrevent = (event: any) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    event.stopPropagation();
  }
}
</script>

<template>
  <BotSetupCard title="What kind of Business do you own?" description="Select your basic details and chatbot appearance"
    currentStep="2" totalSteps="5">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextField @keydown="inputFieldEnterPrevent($event)" label="Company Name" name="COMPANY"
        class="text-[10px] sm:text-[10px] md:text-[14px]" placeholder="Enter Your Company Name" v-model="NAME" />

      <TextField @keydown="inputFieldEnterPrevent($event)" label="Chatbot Name" name="BotName"
        class="text-[10px] sm:text-[10px] md:text-[14px]" placeholder="Enter Your Chatbot Name" v-model="BotName" />
      <TextField @keydown="inputFieldEnterPrevent($event)" label="Chat Agent Name" name="NAME"
        class="text-[10px] sm:text-[10px] md:text-[14px]" placeholder="Enter Your Chat Agent Name" v-model="COMPANY" />
    </div>

    <div class="flex flex-col gap-[6px]">
      <UiCardTitle class="font-bold text-[14px] text-[14px] md:text-[20px] text-[#09090B]">
        Your Chat Bot's Basic Appearance
      </UiCardTitle>
      <UiCardDescription class="font-normal text-[12px] sm:text-[12px] md:text-[14px] text-[#71717A]">
        Select what you would like your bot to help you with
      </UiCardDescription>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:md:grid-cols-1 xl:md:grid-cols-2 w-full rounded-lg gap-4">
      <UiFileUpload @change="handleLogoChange" name="logo"
        :label="(logo?.url) ? 'Change your logo here, browse files' : 'Upload your logo here, Browse files'"
        :required="true" :accept="'image/*'" :url="logo?.url" :fileType="'image'" :class="'h-24 cursor-pointer'"
        :helperText="'Only files up to 5MB can be uploaded.'" :showFilename="false" />
      <!-- </div> -->
      <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 w-full gap-5">
        <UiFormField v-slot="{ componentField }" name="color">
          <UiFormItem class="w-full">
            <UiFormControl>
              <div
                class="flex items-center gap-8 rounded-lg bg-white py-[28px] px-[16px] border-[1px] border-solid border-[#E4E4E7]"
                @click="openPrimaryColorPicker">
                <div class="flex items-center w-full justify-between">
                  <div>
                    <label class="text-[12px] sm:text-[12px] md:text-[16px] font-medium"> Primary Color</label>
                    <div class="text-[#71717A] text-[8px] sm:text-[8px] md:text-[10px]">Colors for widget & chat button
                    </div>
                  </div>
                  <div class="h-9 w-9 border border-[#E4E4E7] relative overflow-hidden rounded-lg"
                    :style="{ backgroundColor: props.values.color }">
                    <UiInput ref="colorInput" v-bind="componentField" type="color"
                      class="absolute inset-0 opacity-0 cursor-pointer" />
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
                class="flex items-center gap-8 rounded-lg bg-white py-[28px] px-[16px] border-[1px] border-solid border-[#E4E4E7]"
                @click="openSecondaryColorPicker">
                <div class="flex items-center w-full justify-between">
                  <div>
                    <label class="text-[12px] sm:text-[12px] md:text-[16px] font-medium">Secondary Color</label>
                    <div class="text-[#71717A] text-[8px] sm:text-[8px] md:text-[10px]">Colors for messages</div>
                  </div>
                  <div class="h-9 w-9 border border-[#E4E4E7] relative overflow-hidden rounded-lg"
                    :style="{ backgroundColor: props.values.secondaryColor }">
                    <UiInput ref="secondarycolorInput" v-bind="componentField" type="color"
                      class="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>
            </UiFormControl>
          </UiFormItem>
        </UiFormField>
      </div>
    </div>
  </BotSetupCard>
</template>