<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import { useField, useForm } from 'vee-validate';

const props = defineProps<{
  values: Record<string, any>;
  errors: Record<string, any>;
}>();

const emit = defineEmits(["update:values"]);

// Intent options
const intentOptions = ref([
  { label: "Help users find properties based on their preferences (budget, location, type, amenities) and provide personalized listings", value: "greeting", content: 'Property Inquiry & Recommendations' },
  { label: "Capture user details, qualify leads, and schedule property viewings or meetings with agents", value: "faq", content: 'Lead Generation & Appointment Booking' },
  { label: "Offer loan and mortgage estimations, connect users with financial advisors, and guide them through the home-buying process", value: "support", content: 'Mortgage & Financing Assistance' },
  { label: "Provide estimated property values, connect sellers with agents, and assist in listing properties for sale or rent", value: "sales", content: 'Property Valuation & Selling Assistance' },
]);

// Use `useField` for validation
const { value: selectedIntents } = useField<string[]>('intent', undefined, {
  initialValue: props.values.intent || []
});

// Watch and emit updates when the user selects/deselects intents
const toggleIntent = (checked: boolean, value: string) => {
  const updatedIntent = checked
    ? [...selectedIntents.value, value]
    : selectedIntents.value.filter((item) => item !== value);

  selectedIntents.value = updatedIntent;
  emit("update:values", { ...props.values, intent: updatedIntent });
};
</script>

<template>
  <Card class="border-0 ma-0">
    <CardHeader class="p-0">
      <div class="flex flex-col gap-4">
        <CardDescription class="text-[14px] sm:text-[14px] md:text-[18px] font-medium">
          <span class="text-[#09090B]">Step 2</span><span class="text-[#64748B]">/3</span>
        </CardDescription>
        <div class="flex flex-col gap-[6px]">
          <CardTitle class="font-bold text-[16px] md:text-[20px] text-[#09090B]">Define your Chatbot's Role
            in your Company</CardTitle>
          <CardDescription class="font-normal text-[12px] sm:text-[12px] md:text-[14px] text-[#71717A]">
            Select what you would like your bot to help you with
          </CardDescription>
        </div>
      </div>
    </CardHeader>

    <div class="mt-4">
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full h-[0.5px]" />
    </div>

    <CardContent class="grid gap-6 my-6 px-0">
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5">
        <div v-for="option in intentOptions" :key="option.value"
          class="flex items-center gap-4 border p-4 rounded-lg cursor-pointer">
          <div class="flex gap-4">
            <span>
              <UiCheckbox class="h-4 w-4 sm:h-4 sm:w-4 md:h-6 md:w-6" :checked="selectedIntents.includes(option.value)"
                @update:checked="(checked) => toggleIntent(checked, option.value)" />
            </span>
            <div class="flex flex-col gap-1">
              <span class="font-medium text-[12px] sm:text-[12px] md:text-[14px]">{{ option.content }}</span>
              <span class="text-[#71717A] text-[10px] sm:text-[10px] md:text-[12px]">{{ option.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
