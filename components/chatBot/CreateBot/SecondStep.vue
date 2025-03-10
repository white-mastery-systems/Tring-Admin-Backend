<script setup lang="ts">
import { useField } from "vee-validate";
import { ref } from "vue";
import {
  Landmark,
  Banknote,
  Home,
  Stethoscope,
  ShoppingCart,
  Lightbulb,
  PhoneCall,
  Plane,
  Truck,
  GraduationCap,
  Server
} from "lucide-vue-next";
import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';

const props = defineProps<{
  errors: Record<string, any>;
  values: Record<string, any>;
}>();

// ✅ Use `useField()` from vee-validate
const { value: COMPANY } = useField("COMPANY");
const { value: NAME } = useField("NAME");
const { value: color } = useField("color");
const { value: secondaryColor, } = useField("secondaryColor");
const { value: selectedType } = useField("type");
const { value: logo } = useField("logo");
const colorInput = ref();
const secondarycolorInput = ref();

const { intentOptions, status, error, fetchConfig } = useChatbotConfig();

// Call fetchConfig when needed (e.g., on mount or on type change)

const intentTypes = [
  { label: "Real Estate", value: "real-estate", icon: Home },
  { label: "Government Sectors", value: "government-sectors", icon: Landmark },
  { label: "Finance & Banking", value: "finance-banking", icon: Banknote },
  { label: "Healthcare", value: "healthcare", icon: Stethoscope },
  { label: "E-commerce", value: "e-commerce", icon: ShoppingCart },
  { label: "Energy & Utilities", value: "energy-utilities", icon: Lightbulb },
  { label: "Telecommunications", value: "telecommunications", icon: PhoneCall },
  { label: "Travel & Hospitality", value: "travel-hospitality", icon: Plane },
  { label: "Logistics", value: "logistics", icon: Truck },
  { label: "Education & Training", value: "education-training", icon: GraduationCap },
  { label: "IT Service", value: "it-service", icon: Server },
];
const logoData = ref()
// ✅ Function to update industry selection
const selectIndustry = (value: any) => {
  selectedType.value = value;
  fetchConfig(value);
};
const openPrimaryColorPicker = () => colorInput.value.$el.click();
const openSecondaryColorPicker = () => secondarycolorInput.value.$el.click();
const handleLogoChange = (event: any) => {
  // Assuming event returns an array of files, take the first one
  logoData.value = event[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    // Update the field value with the data URL
    logo.value = { url: e.target.result };
  };
  reader.readAsDataURL(logoData.value);
};
</script>

<template>
  <Card class="border-0">
    <CardHeader>
      <div class="flex items-center justify-between gap-4 px-4 pt-4">
        <div class="flex flex-col gap-[6px]">
          <CardTitle class="font-bold text-[16px] text-[16px] md:text-[20px] text-[#09090B]">What kind of Business do
            you own?
          </CardTitle>
          <CardDescription class="font-normal text-[12px] sm:text-[12px] md:text-[14px] text-[#71717A]">
            Select your industry type and other details
          </CardDescription>
        </div>
        <CardDescription class="text-[14px] font-medium">
          <span class="text-[#09090B]">Step 2</span><span class="text-[#64748B]">/4</span>
        </CardDescription>
      </div>
    </CardHeader>

    <div class="mt-4">
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full h-[0.5px]" />
    </div>


    <CardContent class="grid gap-6 my-6 px-4">
      <!-- {{ intentTypes }} || intentTypes -->
      <!-- ✅ Industry selection - FIXED: Using selectedType directly in the class binding -->
      <RadioGroup v-model="selectedType" class="flex gap-4 w-full overflow-x-auto min-h-[165px] overflow-y-hidden">
        <div v-for="intent in intentTypes" :key="intent.value"
          class="min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px] md:min-w-[135px] md:max-w-[135px] md:min-h-[135px] md:max-h-[135px]"
          @click.stop="selectIndustry(intent.value)">
          <RadioGroupItem :id="intent.value" :value="intent.value" class="peer hidden" />
          <Label :for="intent.value"
            class="w-full h-full flex items-center justify-center p-4 rounded-lg bg-[#F2F2F2] transition-all duration-300"
            :class="[selectedType === intent.value ? 'border-2 border-[#09090b]' : 'border-transparent']">
            <component :is="intent.icon" class="w-[50px] h-[50px]" :stroke-width="0.75" />
          </Label>
          <div class="text-[12px] md:text-[14px] font-medium mt-2 text-center">{{ intent.label }}</div>
        </div>
      </RadioGroup>
      <!-- {{ props }} || asdad -->
      <!-- ✅ Company Name & Chatbot Name fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField label="Company Name" name="COMPANY" class="text-[14px]" placeholder="Enter Your Company Name"
          v-model="NAME" />

        <TextField label="Chatbot Name" name="NAME" class="text-[14px]" placeholder="Enter Your Chatbot Name"
          v-model="COMPANY" />
      </div>

      <div class="flex flex-col gap-[6px]">
        <CardTitle class="font-bold text-[16px] text-[16px] md:text-[20px] text-[#09090B]">
          Your Chat Bot's Basic Appearance
        </CardTitle>
        <CardDescription class="font-normal text-[12px] sm:text-[12px] md:text-[14px] text-[#71717A]">
          Select what you would like your bot to help you with
        </CardDescription>
      </div>

      <div class="flex w-full rounded-lg gap-4">
        <div class="flex w-full">
          <!-- {{ props }}
          {{ logo }} || asdsad -->
          <!-- {{ logo }} || asdsadas -->
          <UiFileUpload @change="handleLogoChange" name="logo"
            :label="(logo?.url) ? 'Change your logo here, browse files' : 'Upload your logo here, Browse files'"
            :required="true" :accept="'image/*'" :url="logo?.url" :fileType="'image'" :class="'h-24 cursor-pointer'"
            :helperText="'Only files up to 5MB can be uploaded.'" :showFilename="false" />
        </div>
        <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 w-full gap-5">
          <UiFormField v-slot="{ componentField }" name="color">
            <UiFormItem class="w-full">
              <UiFormControl>
                <div
                  class="flex items-center gap-8 rounded-lg bg-white p-[26px] border-[1px] border-solid border-[#E4E4E7]"
                  @click="openPrimaryColorPicker">
                  <div class="flex items-center w-full justify-between">
                    <div>
                      <label class="text-[16px] font-medium"> Primary Color</label>
                      <div class="text-[#71717A] text-[12px]">Colors for widget & chat button</div>
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
                  class="flex items-center gap-8 rounded-lg bg-white p-[26px] border-[1px] border-solid border-[#E4E4E7]"
                  @click="openSecondaryColorPicker">
                  <div class="flex items-center w-full justify-between">
                    <div>
                      <label class="text-[16px] font-medium">Secondary Color</label>
                      <div class="text-[#71717A] text-[12px]">Colors for messages</div>
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
    </CardContent>
  </Card>
</template>