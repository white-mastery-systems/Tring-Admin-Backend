<template>
  <DialogWrapperVersionTwo v-model="ChatBotSuccessfulMessageModalState"
    title="Your Chatbot has been created successfully"
    description="Copy & send script to get started with your bot or preview your bot" class="p-5 w-full">
    <div class="p-0 space-y-4 bg-white rounded-lg shadow-none">
      <div class="px-0 sm:px-0 md:px-4 space-y-3">
        <div>
          <h3 class="text-[12px] sm:text-[12px] md:text-[16px] font-semibold text-[#09090B]">
            Copy Script and paste on your website
          </h3>
          <p class="text-[#71717A] text-[10px] sm:text-[10px] md:text-[14px]">Copy the script code below</p>
        </div>
        <UiInput v-model="botScript" class="w-full" readonly @focus="(e) => e.target.blur()" />
      </div>
      <div class="flex flex-col gap-2 mt-4 px-0 sm:px-0 md:px-5">
        <div class="flex items-center gap-3 mt-2">
          <!-- Copy Script Button -->
          <UiButton @click="copyScript"
            :class="copyBot ? 'bg-[#FFBC42] text-white button_shadow border-[#FFBC42]' : 'bg-[#ffff] border-black text-black focus:border-black'"
            class="flex items-center text-[10px] sm:text-[10px] md:text-[14px] gap-2 cursor-pointer border hover:bg-[#FFBC42] hover:border-[#FFBC42] hover:text-white focus:outline-none focus:ring-0">
            <FileCode class="w-4 sm:w-4 md:w-5 h-4 sm:h-4 md:h-5" /> Copy Script
          </UiButton>

          <!-- Send Script Button -->
          <UiButton @click="() => {
            previewBot = true
            copyBot = false
            }" as="a" :href="previewUrl" target="_blank"
            class="flex items-center text-[10px] sm:text-[10px] md:text-[14px] gap-2 cursor-pointer border hover:bg-[#FFBC42] hover:border-[#FFBC42] hover:text-white focus:outline-none focus:ring-0"
            :class="previewBot ? 'bg-[#FFBC42] text-white button_shadow border-[#FFBC42]' : 'bg-[#ffff] border-black text-black focus:border-black'">
            <Eye class="w-4 sm:w-4 md:w-5 h-4 sm:h-4 md:h-5" /> Preview Bot
          </UiButton>
        </div>

        <!-- Separator -->
        <div class="border-b border-gray-300 mt-4 mb-3"></div>

        <!-- Preview Section -->
        <div>
          <h3 class="text-[12px] sm:text-[12px] md:text-[16px] font-semibold text-[#09090B]">Share Your Chatbot Script
          </h3>
          <p class="text-[10px] sm:text-[10px] md:text-[14px] text-[#71717A]">
            You can copy the script above to embed your chatbot on your website, or send it via email.
          </p>
        </div>
        <div class="mt-2 flex w-full">
          <UiButton @click="toggleForm"
            :class="showForm ? 'bg-[#FFBC42] text-white button_shadow border-[#FFBC42]' : 'text-black border-black'"
            :variant="(showForm) ? '' : 'outline'"
            class="flex items-center text-[10px] sm:text-[10px] md:text-[14px] gap-2 cursor-pointer border hover:bg-[#FFBC42] hover:border-[#FFBC42] hover:text-white focus:outline-none focus:ring-0">
            <Mail class="w-4 sm:w-4 md:w-5 h-4 sm:h-4 md:h-5" /> Send Script
          </UiButton>
        </div>
        <div v-show="showForm" class="border-[1px] border-gray-300 rounded-lg p-4 mt-2">
          <form class="space-y-4" @submit.prevent="onSubmit">
            <TextField v-model="values.email" type="text" name="email" class="text-[10px] sm:text-[10px] md:text-[14px]"
              label="Send a Mail to" placeholder="Enter email (comma-separated for multiple)" />

            <TextField v-model="values.drafMessage" label="Draft Message"
              class="text-[10px] sm:text-[10px] md:text-[14px]" id="description" name="drafMessage" isTextarea
              placeholder="Enter your message" />

            <div class="flex justify-end w-full">
              <UiButton type="submit" color="primary" class="px-6">Send</UiButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </DialogWrapperVersionTwo>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { FileCode, Mail, Eye } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useClipboard } from "@vueuse/core";

const props = defineProps<{ botDetails: any; refreshBot: () => void }>();
const emit = defineEmits(["success"]);
const route = useRoute();
const ChatBotSuccessfulMessageModalState = defineModel<{ open: boolean; id: any }>({
  default: {
    open: false,
  },
});
const copyBot = ref(false)
const previewBot = ref(false)
const showForm = ref(false);

const toggleForm = () => {
  showForm.value = !showForm.value;
};

// Generate the bot script
const botScript = computed(() => {
  return "<" +
    `script src="${window?.location?.href?.includes("app.tringlabs.ai") ? "https://chat.tringlabs.ai" : "https://tring-databot.pripod.com"}/widget.js" data-chatbotid="${route.params.id}" data-orgname="WMS">` +
    "</" +
    "script>";
});
const { copy } = useClipboard({ source: botScript.value });
const copyScript = async () => {
  copyBot.value = true
  previewBot.value = false
  copy(botScript.value);
  toast.success("Copied to clipboard");
};

const sentMailSchema = toTypedSchema(
  z.object({
    email: z.preprocess(
      (val) => (typeof val === "string" ? val.split(",").map((e) => e.trim()) : val),
      z.array(z.string().email("Invalid email address.")).nonempty("At least one email is required.")
    ),
    drafMessage: z.string({ required_error: "Draft message must be provided." })
      .min(10, "Draft message must be at least 10 characters long."),
  })
);

const { errors,
  setErrors,
  setFieldValue,
  handleSubmit,
  defineField,
  values,
  resetForm, } = useForm({
  validationSchema: sentMailSchema,
  initialValues: {
    drafMessage: botScript.value
  }
});

onMounted(() => {
  setTimeout(() => {
    document.activeElement?.blur(); // Remove focus after modal opens
  }, 100); // Small delay to prevent focus from jumping
});
const previewUrl = computed(() => {
  let col = props.botDetails.metadata.ui.color as string;
  col = col
    ?.split(" ")
    .map((element) => {
      if (element.at(-1) === "%") return element.slice(0, -1);
      else return element;
    })
    .join(" ");
  let secondaryColor = props.botDetails.metadata.ui.secondaryColor as string;
  secondaryColor = secondaryColor
    ?.split(" ")
    .map((element) => {
      if (element.at(-1) === "%") return element.slice(0, -1);
      else return element;
    })
    .join(" ");
  return `${window.location.origin}/preview.html?orgname=WMS&chatbotid=${route.params.id}&mode=preview`;
});


const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await $fetch(`/api/bots/${route.params.id}/sendScript`, {
      method: "POST",
      body: {
        to: Array.isArray(values.email) ? values.email : [values.email], // Ensure it's always an array
        script: values.drafMessage,
      },
    });
    // Handle success (e.g., show a message)
    toast.success("Script sent successfully!");
    resetForm()
  } catch (error) {
    console.error("Failed to send script:", error);
    alert("Failed to send script. Please try again.");
  }
});
</script>
