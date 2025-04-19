<template>
  <div class="absolute inset-0 bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100">
    <!-- Grid background image -->
    <div class="absolute inset-0 z-0 flex items-center justify-center">
      <img src="assets/icons/Line-grid-Black.png" alt="grid background" class="w-[50%] h-full object-cover opacity-10" />
    </div>
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-4 sm:py-4 md:py-8">
      <!-- Title section - responsive text sizes -->
      <h1 class="text-center text-[18px] sm:text-[18px] md:text-[26px] font-bold mb-0 text-gray-800">Select a Bot to <span class="text-indigo-600">Power Your Support</span> <span class="text-amber-400">
        <img src="assets/icons/Star-Yellow.svg" alt="star" class="inline-block ml-1 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mb-[30px]" />
      </span></h1>
      
      <p class="text-[12px] sm:text-[12px] md:text-[14px] text-[#333333] mb-4 sm:mb-6 md:mb-8 text-center">
        Choose between a chatbot or voicebot to engage, assist, and convert<br class="hidden sm:block">
        your customers effortlessly
      </p>
      
      <!-- Card container with responsive sizing -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 w-full max-w-xs sm:max-w-xl md:max-w-2xl">
        <!-- Chatbot card - with fixed height instead of aspect-square -->
        <div 
          class="rounded-xl p-4 sm:p-4 md:p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 h-[220px] sm:h-[220px] md:h-72"
          :class="{ 'bg-indigo-600': selectedBot === 'chat', 'bg-white': selectedBot !== 'chat' }"
          @click="selectBot('chat')"
        >
          <div class="mb-2 sm:mb-3 md:mb-4">
              <component 
              :is="MessageSquare" 
              class="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" 
              :class="selectedBot === 'chat' ? 'text-white' : 'text-[#FFBC42]'"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></component>
          </div>
          <h2 class="text-[18px] sm:text-[18px] md:text-[22px] font-bold mb-1 sm:mb-2" :class="selectedBot === 'chat' ? 'text-amber-400' : 'text-gray-800'">Chatbot</h2>
          <p class="text-xs sm:text-sm md:text-base text-center mb-3 sm:mb-4 md:mb-6" :class="selectedBot === 'chat' ? 'text-white' : 'text-gray-600'">Turn chats into conversions</p>
          <UiButton 
            class="py-1 sm:py-1.5 md:py-2 px-4 sm:px-4 md:px-6 rounded-md text-sm sm:text-base font-medium transition-colors w-[60%] button_shadow"
            :class="selectedBot === 'chat' ? 'bg-amber-400 text-white hover:bg-amber-500' : 'bg-white  border border-amber-400 text-amber-400 hover:bg-amber-50'"
            @click="selectBot('chat')"
          >
            Try Now
          </UiButton>
        </div>
        
        <!-- Voicebot card - with fixed height instead of aspect-square -->
        <div 
          class="rounded-xl p-4 sm:p-4 md:p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 h-[220px] sm:h-[220px] md:h-72 border border-1 border-[#D9D9D9]"
          :class="{ 'bg-indigo-600': selectedBot === 'voice', 'bg-white': selectedBot !== 'voice' }"
          @click="selectBot('voice')"
        >
          <div class="mb-2 sm:mb-3 md:mb-4">
            <component 
              :is="Phone" 
              class="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" 
              :class="selectedBot === 'voice' ? 'text-white stroke-white' : 'text-[#FFBC42] stroke-[#FFBC42]'"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></component>
          </div>
          <h2 class="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2" :class="selectedBot === 'voice' ? 'text-amber-400' : 'text-gray-800'">Voicebot</h2>
          <p class="text-xs sm:text-sm md:text-base text-center mb-3 sm:mb-4 md:mb-6" :class="selectedBot === 'voice' ? 'text-white' : 'text-gray-600'">Your real human AI 24/7</p>
          <UiButton 
            class="py-1 sm:py-1.5 md:py-2 px-4 sm:px-6 md:px-8 rounded-md text-sm sm:text-base font-medium transition-colors w-full button_shadow w-[60%]"
            :class="selectedBot === 'voice' ? 'bg-amber-400 text-white hover:bg-amber-500' : 'bg-white border border-amber-400 text-amber-400 hover:bg-amber-50'"
            @click="selectBot('voice')"
          >
            Try Now
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MessageSquare, Phone } from 'lucide-vue-next';

definePageMeta({
  layout: "billing-account",
  middleware: "guest-only",
});

const selectedBot = ref(''); // Default selection

const selectBot = (bot) => {
  selectedBot.value = bot;
  return navigateTo(`/auth/onboarding/billing?type=${bot}`);
};
</script>