<script setup lang="ts">
import { useField } from "vee-validate";
import { Home, ShoppingCart, Plane, HandPlatter, PhoneCall, Ambulance } from 'lucide-vue-next';

defineProps<{
  errors: Record<string, any>;
}>();

// ✅ Use `useField()` from vee-validate
const { value: companyName } = useField("companyName");
const { value: chatbotName } = useField("name");
const { value: selectedIndustry } = useField("industry");

const intentTypes = [
  { id: 1, value: "real-estate", content: "Real Estate", icon: Home },
  { id: 2, value: "e-commerce", content: "E-commerce", icon: ShoppingCart },
  { id: 3, value: "travel", content: "Travel", icon: Plane },
  { id: 4, value: "hospitality", content: "Hospitality", icon: HandPlatter },
  { id: 5, value: "telecommunications", content: "Telecommunications", icon: PhoneCall },
  { id: 6, value: "finance-bank", content: "Finance Bank", icon: Ambulance },
];

// ✅ Function to update industry selection
const selectIndustry = (value: string) => {
  selectedIndustry.value = value;
};
</script>

<template>
  <Card class="border-0">
    <CardHeader class="p-0">
      <div class="flex flex-col gap-4">
        <CardDescription class="text-[14px] sm:text-[14px] md:text-[18px] font-medium">
          <span class="text-[#09090B]">Step 1</span><span class="text-[#64748B]">/3</span>
        </CardDescription>
        <div class="flex flex-col gap-[6px]">
          <CardTitle class="font-bold text-[16px] md:text-[20px] text-[#09090B]">What kind of business do you own?
          </CardTitle>
          <CardDescription class="font-normal text-[12px] md:text-[14px] text-[#71717A]">
            Select your industry type
          </CardDescription>
        </div>
      </div>
    </CardHeader>

    <div class="mt-4">
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full h-[0.5px]" />
    </div>

    <CardContent class="grid gap-6 my-6 px-0">
      <!-- ✅ Industry selection -->
      <RadioGroup v-model="selectedIndustry" class="flex gap-4 w-full overflow-x-auto min-h-[130px]">
        <div v-for="intent in intentTypes" :key="intent.id"
          class="min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px] md:min-w-[145px] md:max-w-[145px] md:min-h-[145px] md:max-h-[145px]"
          @click.stop="selectIndustry(intent.value)">
          <RadioGroupItem :id="intent.value" :value="intent.value" class="peer hidden" />
          <Label :for="intent.value"
            class="w-full h-full flex items-center justify-center p-4 rounded-lg bg-[#F2F2F2] transition-all duration-300"
            :class="[(selectedIndustry === intent.value) ? 'border-2 border-[#09090b]' : 'border-red-300']">
            <component :is="intent.icon" class="w-[50px] h-[50px]" :stroke-width="0.75" />
          </Label>
          <div class="text-[12px] md:text-[14px] font-medium mt-2">{{ intent.content }}</div>
        </div>
      </RadioGroup>

      <!-- ✅ Company Name & Chatbot Name fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField label="Company Name" name="companyName" class="text-[14px]" placeholder="Enter Your Company Name"
          v-model="companyName" />
        <!-- <span v-if="errors.companyName" class="text-red-500 text-sm">{{ errors.companyName }}</span> -->

        <TextField label="Chatbot Name" name="name" class="text-[14px]" placeholder="Enter Your Chatbot Name"
          v-model="chatbotName" />
        <!-- <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span> -->
      </div>
    </CardContent>
  </Card>
</template>
