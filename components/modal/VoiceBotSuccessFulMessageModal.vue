<template>
  <DialogWrapperVersionVoice v-model="VoiceBotSuccessfulMessageModalState"
    title="Your Voicebot has Been Created Successfully"
    description="Copy & send script to get started with your bot or preview your bot" class="p-5 w-full">
    <div class="space-y-4 bg-white rounded-lg shadow-md">
      <!-- Phone number input section -->
      <div class="px-6 space-y-3">
        <div class="space-y-1">
          <h3 class="text-base font-semibold text-[#09090B]">Enter your Number and test the voicebot</h3>
          <p class="text-[#71717A] text-sm">You will get a call from the bot to the entered number</p>
        </div>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="flex items-center gap-3 grid grid-cols-2 ">
            <TextField name="name" type="text" label=""
              placeholder="Enter name" />
              <div class="flex items-center gap-2 w-full">
                <CountryCodeField class="w-[150px] mt-1" name="countryCode"
                  helperText="Enter your country code" :fieldHeader="true" />
                <TextField :disableCharacters="true" name="phone" helperText=""
                  placeholder="Enter number" />
              </div>
          </div>
          <!-- Call bot button -->
          <UiButton type="submit" variant="default"
            class="bg-black text-white w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 font-regular">
            <PhoneCall class="w-4 h-4" /> Call Bot
          </UiButton>
        </form>
      </div>
    </div>
  </DialogWrapperVersionVoice>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { PhoneCall } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const props = defineProps<{ botDetails: any; refreshBot: () => void }>();
const emit = defineEmits(["success"]);
const route = useRoute();

const VoiceBotSuccessfulMessageModalState = defineModel<{ open: boolean; id: any }>({
  default: {
    open: false,
  },
});

const phoneSchema = toTypedSchema(
  z.object({
    name: z.string({ required_error: "Name is required" }).min(3, "Name must be at least 3 characters"),
    countryCode: z
            .string({ required_error: "Country Code is required" })
            .min(1, "Country Code is required"),
    phone: z.string({ required_error: "Number is required" }),
  }).superRefine((data, ctx) => {
   const lengthRequirement = getCountryLengthRequirement(data.countryCode);
      // Validate mobile number length dynamically
      if (data.phone.length !== lengthRequirement) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Number must be exactly ${lengthRequirement} characters long.`,
          path: ["phone"], // Field with the issue
        });
      }
  })
);

const { handleSubmit, errors, values } = useForm({
  validationSchema: phoneSchema,
  initialValues: {
    countryCode: "+91",
  }
});

const closeModal = () => {
  VoiceBotSuccessfulMessageModalState.value.open = false;
};

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await $fetch(`/api/voicebots/${route.params.id}/dial`, {
      method: "POST",
      body: values,
    });
    toast.success("Call initiated successfully!");
    emit("success");
  } catch (error) {
    toast.error(error?.statusMessage);
  }
});

onMounted(() => {
  setTimeout(() => {
    document.activeElement?.blur(); // Remove focus after modal opens
  }, 100);
});
</script>