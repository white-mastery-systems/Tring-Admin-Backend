<template>
  <DialogWrapperVersionVoice v-model="VoiceBotSuccessfulMessageModalState"
    title="Your Voicebot has Been Created Successfully"
    description="Copy & send script to get started with your bot or preview your bot" class="p-5 w-full">
    <div class="space-y-4 bg-white rounded-lg shadow-md">
      <!-- Phone number input section -->
      <div class="px-6 space-y-3">
        <div>
          <h3 class="text-base font-semibold text-[#09090B]">Enter your Number and test the voicebot</h3>
          <p class="text-[#71717A] text-sm">You will get a call from the bot to the entered number</p>
        </div>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <TextField v-model="values.phoneNumber" type="text" name="phoneNumber" label=""
            placeholder="Enter phone number" />
          
          <!-- Call bot button -->
          <UiButton type="submit" variant="default"
            class="bg-black text-white w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 font-regular">
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
    phoneNumber: z.string()
      .regex(/^\+?[0-9\s-]{10,15}$/, "Please enter a valid phone number")
      .min(10, "Phone number must be at least 10 digits"),
  })
);

const { handleSubmit, errors, values } = useForm({
  validationSchema: phoneSchema,
  initialValues: {
    phoneNumber: "",
  }
});

const closeModal = () => {
  VoiceBotSuccessfulMessageModalState.value.open = false;
};

const onSubmit = handleSubmit(async (values) => {
  try {
    // const response = await $fetch(`/api/voicebots/${route.params.id}/call`, {
    //   method: "POST",
    //   body: {
    //     phoneNumber: values.phoneNumber,
    //   },
    // });
    
    toast.success("Call initiated successfully!");
  } catch (error) {
    console.error("Failed to initiate call:", error);
    toast.error("Failed to initiate call. Please try again.");
  }
});

onMounted(() => {
  setTimeout(() => {
    document.activeElement?.blur(); // Remove focus after modal opens
  }, 100);
});
</script>