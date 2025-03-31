<script setup lang="ts">
import { useField } from "vee-validate";
import { ref } from "vue";
// import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';

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

// const { intentOptions, status, error, fetchConfig } = useChatbotConfig();

// Call fetchConfig when needed (e.g., on mount or on type change)

const logoData = ref()
// ✅ Function to update industry selection
// const selectIndustry = (value: any) => {
//   selectedType.value = value;
//   // props.fetchConfig(value);
// };
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
        // url: e.target.result
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
</script>

<template>
  <BotSetupCard title="What kind of Business do you own?" description="Select your industry type and other details"
    currentStep="2" totalSteps="4">
    <!-- {{ intentTypes }} || intentTypes -->
    <!-- ✅ Industry selection - FIXED: Using selectedType directly in the class binding -->
    <!-- <RadioGroup v-model="selectedType" class="flex gap-4 w-full overflow-x-auto min-h-[165px] overflow-y-hidden">
        <div v-for="intent in intentTypes" :key="intent.value"
          class="min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px] md:min-w-[135px] md:max-w-[135px] md:min-h-[135px] md:max-h-[135px]"
          @click.stop="selectIndustry(intent.value)">
          <RadioGroupItem :id="intent.value" :value="intent.value" class="peer hidden" />
          <Label :for="intent.value"
            class="w-full h-full flex items-center justify-center p-4 rounded-lg bg-[#F2F2F2] transition-all duration-300"
            :class="[selectedType === intent.value ? 'border-2 border-[#09090b]' : 'border-transparent']">
            <component :is="intent.icon" class="w-[50px] h-[50px]" :stroke-width="0.75" />
          </Label>
          <div class="text-[12px] md:text-[12px] font-medium mt-2 text-center">{{ intent.label }}</div>
        </div>
      </RadioGroup> -->
    <!-- {{ props }} || asdad -->
    <!-- ✅ Company Name & Chatbot Name fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextField label="Company Name" name="COMPANY" class="text-[10px] sm:text-[10px] md:text-[14px]"
        placeholder="Enter Your Company Name" v-model="NAME" />

      <TextField label="Chatbot Name" name="BotName" class="text-[10px] sm:text-[10px] md:text-[14px]"
        placeholder="Enter Your Chatbot Name" v-model="BotName" />
      <TextField label="Chat Agent Name" name="NAME" class="text-[10px] sm:text-[10px] md:text-[14px]"
        placeholder="Enter Your Chat Agent Name" v-model="COMPANY" />
    </div>

    <div class="flex flex-col gap-[6px]">
      <UiCardTitle class="font-bold text-[14px] text-[14px] md:text-[20px] text-[#09090B]">
        Your Chat Bot's Basic Appearance
      </UiCardTitle>
      <UiCardDescription class="font-normal text-[12px] sm:text-[12px] md:text-[14px] text-[#71717A]">
        Select what you would like your bot to help you with
      </UiCardDescription>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 w-full rounded-lg gap-4">
      <!-- <div class="flex"> -->
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
                  <!-- <div class="h-9 w-9 border border-[#E4E4E7]"
                      :class="[props.values.color ? `bg-${props.values.color}` : '']">
                      <UiInput ref="colorInput" v-bind="componentField" type="color"
                        class="h-full w-full p-0 border-none cursor-pointer" />
                    </div> -->
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
                  <!-- {{ secondaryColor }} -->
                  <!-- <div class="h-9 w-9 border border-[#E4E4E7]">
                      <UiInput ref="secondarycolorInput" v-bind="componentField" type="color"
                        class="h-full w-full p-0 border-none cursor-pointer" />
                    </div> -->
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