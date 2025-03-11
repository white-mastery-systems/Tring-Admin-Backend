import { defineStore } from "pinia";
import { useBotDetails } from "~/composables/botManagement/chatBot/useBotDetails";

export const useBotStore = defineStore("botStore", () => {
let botId = ref();

// Define a function to initialize bot details once
const initBotDetails = (id: string) => {
if (botId.value === id) return; // Prevent multiple calls if the same botId is already set
botId.value = id;
return useBotDetails(id); // Fetch details once and return the composable values
};

return { initBotDetails };
});
