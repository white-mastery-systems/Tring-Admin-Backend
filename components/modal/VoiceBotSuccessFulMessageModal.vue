<template>
    <DialogWrapperVersionTwo v-model="VoiceBotSuccessfulMessageModalState"
      title="Your Voicebot has Been Created Successfully"
      description="Copy & send script to get started with your bot or preview your bot" class="p-5 w-full">
      <div class="p-0 bg-white rounded-lg shadow-md">
        <!-- Header with close button -->
        <!-- <div class="flex justify-between items-center p-4">
          <div>
            <h3 class="text-xl font-bold text-[#09090B]">Your Voicebot has Been Created Successfully</h3>
            <p class="text-[#71717A] text-sm">Copy & send script to get started with your bot or preview your bot</p>
          </div>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <X class="w-5 h-5" />
          </button>
        </div> -->
  
        <!-- Phone number input section -->
        <div class="px-4 space-y-3">
          <div>
            <h3 class="text-base font-semibold text-[#09090B]">Enter your Number and test the voicebot</h3>
            <p class="text-[#71717A] text-sm">You will get a call from the bot to the entered number</p>
          </div>
          <UiInput v-model="phoneNumber" placeholder="+91 83170-18655" class="w-full" />
        </div>
  
        <!-- Call bot button -->
        <div class="px-4 mt-4">
          <!-- @click="callBot" -->
          <UiButton variant="default" 
            class="bg-black text-white w-full sm:w-auto flex items-center justify-center gap-2 py-3">
            <Phone class="w-5 h-5" /> Call Bot
          </UiButton>
        </div>
      </div>
    </DialogWrapperVersionTwo>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { useRoute } from "vue-router";
  import { Phone, X } from 'lucide-vue-next';
  
  // const props = defineProps<{ botDetails: any; refreshBot: () => void }>();
  const emit = defineEmits(["success"]);
  const route = useRoute();
  
  const VoiceBotSuccessfulMessageModalState = defineModel<{ open: boolean; id: any }>({
    default: {
      open: false,
    },
  });
  
  const phoneNumber = ref("+91 83170-18655");
  
  const closeModal = () => {
    VoiceBotSuccessfulMessageModalState.value.open = false;
  };
  
  // const callBot = async () => {
  //   try {
  //     const response = await $fetch(`/api/voicebots/${route.params.id}/call`, {
  //       method: "POST",
  //       body: {
  //         phoneNumber: phoneNumber.value,
  //       },
  //     });
      
  //     toast.success("Call initiated successfully!");
  //   } catch (error) {
  //     console.error("Failed to initiate call:", error);
  //     toast.error("Failed to initiate call. Please try again.");
  //   }
  // };
  
  onMounted(() => {
    setTimeout(() => {
      document.activeElement?.blur(); // Remove focus after modal opens
    }, 100);
  });
  </script>