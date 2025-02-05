<template>
  <Page title="Leads" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4">
        <div class="flex gap-2">
          <ExportButton v-model="exportDataHandler" buttonContent="Export Data" :rows="exportReadyRows"
            :columns="exportReadyColumns" @export="exportData" />
        </div>
      </div>
    </template>
    <UiTabs default-value="chat" class="w-full self-start">
      <UiTabsList class="grid w-full grid-cols-2">
        <UiTabsTrigger value="chat" @click="() => {
          filters.type = 'chat'
          filters.period = 'all'
        }">
          Chat
        </UiTabsTrigger>
        <UiTabsTrigger value="voice" @click="() => {
          filters.type = 'voice'
          filters.period = 'all'
        }">
          Voice
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="chat">
        <ChatBotLeads :filters="filters" />
      </UiTabsContent>
      <UiTabsContent value="voice">
        <VoiceBotLeads :filters="filters" />
      </UiTabsContent>
    </UiTabs>
  </Page>
</template>
<script setup lang="ts">
import { format } from "date-fns";
import { useState } from "#app";
import { useRouter } from "vue-router";

definePageMeta({
  middleware: "user",
});

useHead({
  title: "Analytics | Leads",
});

const exportDataHandler = ref({ status: false, type: "csv" });
const currentPage = useState("counter", () => '1');
const router = useRouter();

const filters = reactive<{
  botId: string;
  q?: string;
  from?: string;
  to?: string;
  period: string;
  status: string;
  channel: any;
  action: string;
  page: string;
  limit: string;
  country: string;
  type: string;
}>({
  botId: "",
  q: undefined,
  from: undefined,
  to: undefined,
  period: "",
  status: "",
  channel: "all",
  action: "",
  page: currentPage.value,
  limit: "10",
  country: "all",
  type: "chat",
});

watchEffect(() => {
  if (filters.botId === "all") filters.botId = "";
});

watch(
  () => filters.page,
  (newPage) => {
    currentPage.value = newPage; // Save page number globally
  }
);
const exportFilters = computed(() => {
  const { page, limit, ...restFilters } = filters; // Destructure to exclude 'page' and 'limit'
  return restFilters;
});

const exportReadyRows = ref<any>([]);

const exportReadyColumns = computed(() => {
  if (exportFilters.value.type === "chat") {
    return [
      "Name",
      "Email",
      "Mobile",
      "Country code",
      "Visited status",
      "Bot name",
      "Country",
      "Created at",
    ];
  } else if (exportFilters.value.type === "voice") {
    return ["Name", "Location", "Phone", "createdAt", "scheduledDate", "Notes", "Bot Name",];
  } else {
    // Default or fallback columns
    return [
      "Name",
      "Email",
      "Mobile",
      "Country code",
      "Visited status",
      "Bot name",
      "Country",
      "Created at",
    ];
  }
});

onMounted(() => {
  resetPageForLeads()
});

const resetPageForLeads = () => {
  const historyState = router.options.history.state || {};
  const backPath = historyState.back || "";

  if (!historyState.forward) {
    if (!backPath?.startsWith("/analytics/leads/")) {
      currentPage.value = '1'; // Reset page number when revisiting
      filters.page = '1';
    }
  }
};

const exportData = async () => {
  try {
    const exportLeads = await $fetch("/api/org/leads", {
      query: exportFilters.value,
      method: "GET",
      headers: {
        "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    });

    const exportReadObject = (exportLeads ?? []).map((lead: any) => {
      let mergedObject = {}
      if (filters.type === "chat") {
        mergedObject = {
          name: lead.botUser.name ?? "---",
          email: lead.botUser.email ?? "---",
          mobile: lead?.botUser?.mobile ?? "---",
          countryCode: lead?.botUser?.countryCode ?? "+91",
          visitedStatus:
            Number(lead?.botUser?.visitedCount) > 1 ? "Revisited" : (lead.status === "junk") ? "Junk" : "New",
          botName: lead.bot.name ?? "---",
          country: lead.chat?.metadata?.country ?? "---",
          createdAt: format(lead.botUser.createdAt, "MMMM d, yyyy"),
          // ClientId: lead.botUser.id,
        };
      } else {
        mergedObject = {
          name: lead.name ?? "---",
          phone: lead?.phone ?? "---",
          location: lead?.location ?? "---",
          createdAt: format(lead.createdAt, "MMMM d, yyyy"),
          scheduledDate: format(lead.scheduledDate, "MMMM d, yyyy"),
          notes: lead?.notes ?? "---",
          botName: lead.bot.name ?? "---",
          // ClientId: lead.botUser.id,
        };
      }
      return mergedObject;
    });

    exportDataHandler.value.status = true;
    exportReadyRows.value = exportReadObject;
  } catch (err) { }
};
</script>
