<template>
  <!-- <DialogWrapper v-model="agentModalState" :title="agentModalState.id ? 'Modify Chat Bot' : 'Add a New Chat Bot'"> -->
  <form @submit.prevent="handleAddEditBot" class="flex items-center px-2">
    <div class="flex items-center w-full gap-2 sm:gap-2 md:gap-6">
      <span class="font-semibold w-[210px] text-[10px] sm:text-[10px] md:text-[16px] ">Import from Website</span>
      <TextField class="border-0 field_shadow" name="url" placeholder="URL" required>
      </TextField>
      <UiButton type="submit" :loading="isLoading" class="text-[12px] h-[40px]">
        Import
      </UiButton>
    </div>

    <!-- <div class="mt-2 flex w-full justify-end">
      </div> -->
  </form>
  <!-- </DialogWrapper> -->
</template>

<script setup lang="ts">
import { ToastTitle } from "radix-vue";
import { useRoute } from "vue-router";
import { any } from "zod";
import { botTypes } from '~/composables/botManagement/chatBot/useBotType'
import { useCleanJson } from "~/composables/botManagement/chatBot/useCleanJson";
import { botStore } from '~/store/botStore';

// import { useCleanJson } from "~/composables/botManagement/chatBot/useCleanJson";

definePageMeta({
  middleware: "admin-only",
});
const scrapData = botStore();
const { cleanAndParseJson } = useCleanJson();
// const arrrayDetail = ref("```json\n{\n  \"brand\": {\n    \"logo_url\": \"https://api.tringlabs.ai//uploads/logo_new_a1dbc2ee47.png\",\n    \"name\": \"Tring AI\",\n    \"description\": \"AI-powered automation to arrange meetings, qualify leads, and handle support tickets on autopilot.\"\n  },\n  \"chatbot\": {\n    \"name\": \"Alice\",\n    \"role\": \"AI-Powered Customer Support Assistant\",\n    \"goal\": \"To provide instant, smooth, and personalized customer service through automated conversations, handling inquiries, and streamlining workflows.\",\n    \"primary_color\": \"hsl(210, 100%, 50%)\",\n    \"secondary_color\": \"hsl(150, 100%, 50%)\"\n  },\n  \"knowledge_base\": {\n    \"document_content\": \"Tring AI provides AI Phone and Chat Agents to automate Chatbot and Voice Bot functionalities. Trusted by 100+ clients, Tring AI offers AI-powered automation for arranging meetings, qualifying leads, and handling support tickets on autopilot. \\n\\n**Reimagine Customer Service with AI-Powered Chatbot & Voicebot**\\n\\nMake your customer service conversations instant, smooth, and personalized with an AI chatbot that offers round-the-clock support. Automate inbound and outbound calls with an AI voice bot that speaks your customer’s language and ensures they never wait long.\\n\\n**Industry-leading Conversational AI Chat and Voice Bot**\\n\\nTring AI helps you save more by cutting down operational costs with the best AI chatbot and voice bot in the market. It automates customer service, freeing up your agents to focus on more complex issues. Provide smart and quicker responses instantly to avoid irritating customers by reducing wait times. Operate 24/7 to be there for your customers without actually being there and never miss an interaction.\\n\\n**Connect Tring AI to Your Tech Stack**\\n\\nTring AI can connect to your existing tech stack, including more than 100+ tools to integrate seamlessly.\\n\\n**Transforming Customer Experience Across Industries**\\n\\nTring AI provides solutions across various industries:\\n\\n*   **AI in Real Estate:** Handle property inquiries, schedule site visits, and follow up on leads.\\n*   **AI in Retail:** Provide personalized shopping assistance and handle customer queries.\\n*   **AI in Travel & Hospitality:** Manage booking-related queries and increase online stay and travel bookings.\\n*   **AI in Healthcare:** Schedule appointments, provide health information, and enhance patient care.\\n*   **AI in Education:** Manage administrative tasks and answer parent and student queries.\\n*   **AI in Telecommunications:** Assist with customer service queries, account management, and support self-service.\\n*   **AI in Transport and Logistics:** Optimize route planning, track shipments in real time, and enhance fleet management.\\n*   **AI in Government Sector:** Automate routine tasks, provide public service information, and enhance citizens' support.\\n*   **AI in Energy:** Provide real-time energy usage insights and handle customer service requests.\\n*   **AI in Business Support Service:** Automate routine tasks, streamline workflows, and improve decision-making processes.\\n*   **AI in Utilities:** Handle simple and complex customer inquiries and help with account management.\\n\\n**AI Agents that Elevate Customer Experience**\\n\\nSee the difference AI-powered chatbots and voice bots can bring to your business with Tring AI. Solve customer problems quickly and scale your operations with an elevated customer experience.\\n\\nTring AI helps to achieve:\\n\\n*   92% Deflected Queries\\n*   64% Lesser Wait Times\\n*   33% Reduction in Avg Response Times\\n*   57% More Lead Generation\\n*   23% Increased Conversions\\n*   47% Cost Cut Down\\n\\n**Hear from Our Customers**\\n\\nRithvik Gowda: \\\"I was looking for a solution that automates routine customer service tasks and then we found Tring AI chatbot. It has completely transformed the way we work and improved the customer service experience. It handles inquiries 24/7, providing instant answers to our customers, and has significantly reduced the workload on our support team.\\\"\\n\\nDhruv Sharma: \\\"The integration of both AI chatbot and voice bot has allowed us to cater to a broader audience. Now, our customers can choose their preferred way to interact with us, and the transition between chat and voice is seamless. It has enhanced our service efficiency and customer satisfaction.\\\"\\n\\nPriya Ranganathan: \\\"The AI chatbot has been a lifesaver for our team. It’s always there to help customers with their questions, even in the middle of the night. We’ve cut down on emails and calls, and our customers love the quick responses.\\\"\\n\\nHanan Khan: \\\"We were able to drive 30% more leads because of Tring AI voice bot. It’s empathetic, quick, and gets things done without any fuss. Our call wait times have dropped, and customers are getting the help they need faster than ever.\\\"\\n\\nRegina George: \\\"We’ve seen such a positive impact since rolling out both the chatbot and voice bot. Customers get what they need faster, and our team has more time to focus on complex issues. It’s like having an extra pair of hands—and our customers really appreciate it.\\\"\\n\\nChris Martin: \\\"At first I had my doubts but I was impressed with the demo. The AI voicebot has drastically improved our customer call experience, particularly in handling high volumes of routine property-related inquiries. It’s intuitive, accurate, and has contributed to a smoother workflow across our system.\\\"\\n\\nAdil Ahamed: \\\"Tring AI is amazing! It quickly and accurately processes our customer requests and has reduced wait times. The natural, conversational tone makes it feel like our customers are talking to a real person, which has significantly enhanced our brand's customer service experience.\\\"\\n\\n**Explore the World of AI**\\n\\n*   Restaurant Chatbots Use Cases: How Restaurants Can Use Chatbots Effectively?\\n*   Virtual Assistant vs Chatbot: What Are the Key Differences and Which Is Right for You?\\n\\n**Frequently Asked Questions**\\n\\n**What is Tring AI?**\\nTring AI is an advanced AI-powered chatbot and voice bot solution designed to automate and enhance customer service interactions. It can handle both chat-based and call-based queries, providing instant support, reducing wait times, and improving customer satisfaction.\\n\\n**How does Tring AI work?**\\nTring AI uses natural language processing (NLP) and machine learning to understand and respond to customer inquiries in real-time. The AI chatbot handles text-based communication on websites, apps, or messaging platforms, while the AI voice bot interacts with customers through voice calls. Tring AI can be trained to recognize specific phrases, understand customer intent, and provide relevant responses or actions based on predefined rules or learned patterns.\\n\\n**Are AI chatbots and voice bots cost-effective?**\\nYes, AI chatbots and voice bots are cost-effective solutions for businesses. They can handle a large volume of customer inquiries simultaneously, reducing the need for human agents and lowering operational costs. By automating routine tasks and providing 24/7 support, businesses save time and resources while improving service efficiency. Tring AI is the most affordable AI-powered chat and voice solution in the market!\\n\\n**What are the benefits of using an AI chatbot and voice bot?**\\nThe benefits of using Tring AI chatbot and voice bot include: 24/7 availability, Instant responses, Scalability, Empathetic, Cost savings\\n\\n**Can I integrate AI chatbot and voice bot with other tools?**\\nYes, Tring AI chatbot and voice bot can be integrated with various tools and platforms, such as CRM systems like Zoho, Salesforce, Hubspot, scheduling tools, and more. This integration allows them to perform tasks like retrieving customer data, processing orders, scheduling appointments, and other actions that enhance the overall customer experience and streamline operations.\\n\\n\"\n  }\n}\n```")
// const emit = defineEmits(["scrapedData"]);

// const agentModalState = defineModel<{ open: boolean; id: any }>({
//   default: {
//     open: false,
//     id: null,
//   },
// });
const route = useRoute();
const queryId = ref(route.params?.id);
// const emit = defineEmits<{
//   (e: "confirm"): void;
//   (e: "editConfirm"): void;
// }>();
const isLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    url: z.string().optional(),
  })
);

const { handleSubmit, setFieldValue, resetForm, values, errors } = useForm({
  validationSchema: formSchema,
});

// watch(
//   () => agentModalState.value.open,
//   async () => {
//     resetForm();
//     if (agentModalState.value.id) {
//       const getSingleDetails: any = await $fetch(
//         `/api/bots/${agentModalState.value.id}`,
//       );
//       setFieldValue("name", getSingleDetails.name);
//       setFieldValue("type", getSingleDetails.type);
//       if (getSingleDetails?.integrationId) {
//         setFieldValue("integrationId", getSingleDetails?.integrationId);
//       }
//     }
//   },
// );

const handleAddEditBot = handleSubmit(async (values) => {
  // console.log(values, "values -- values");
  // if (!values.url) {
  //   toast.error("URL is required");
  //   return;
  // }
  isLoading.value = true;
  try {
    
    const scrapedData: any = await $fetch("/api/org/webScrape", {
      method: "POST",
      body: values,
    });
    const parsedData = cleanAndParseJson(scrapedData);
    scrapData.scrapedData = parsedData;
    // console.log(parsedData, "parsedData -- parsedData")
    // emit("scrapedData", parsedData); 
    toast.success("Updated successfully");
    // }
    // if (agentModalState.value.id) {
    //   emit("editConfirm");
    // } else {
    //   emit("confirm");
    // }
  } catch (err: any) {
    isLoading.value = false;
    toast.error(err.data.data[0].message);
  }
  isLoading.value = false;
});
const {
  status: integrationLoadingStatus,
  data: integrationsData,
  refresh: integrationRefresh,
} = await useLazyFetch("/api/org/integrations", {
  server: false,
  query: {
    q: "ecommerce",
  },
  default: () => [],
});
</script>