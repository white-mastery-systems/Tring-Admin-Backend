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
    <UiTabs v-model="selectedTab" default-value="chat" class="w-full self-start mt-2">
      <UiTabsList class="grid w-full grid-cols-2">
        <UiTabsTrigger value="chat" @click="() => {
          filters.type = 'chat'
          handleClearFilters()
        }">
          <!-- filters.period = 'all' -->
          Chat
        </UiTabsTrigger>
        <UiTabsTrigger value="voice" @click="() => {
          filters.type = 'voice'
          handleClearFilters()
        }">
          <!-- filters.period = 'all' -->
          Voice
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="chat" class="">
        <ChatBotLeads :filters="filters" @clear-filters="handleClearFilters" />
      </UiTabsContent>
      <UiTabsContent value="voice">
        <VoiceBotLeads :filters="filters" @clear-filters="handleClearFilters" />
      </UiTabsContent>
    </UiTabs>
  </Page>
</template>
<script setup lang="ts">
import { format } from "date-fns";
import { useState } from "#app";
import { useRouter } from "vue-router";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store

definePageMeta({
  middleware: "user",
});
const breadcrumbStore = useBreadcrumbStore();

useHead({
  title: "Analytics | Leads",
});
breadcrumbStore.setBreadcrumbs([
  {
    label: "Leads", // Dynamic name
    to: `/analytics/leads`,
  }
]);

const exportDataHandler = ref({ status: false, type: "csv" });
const currentPage = useState("counter", () => '1');
const router = useRouter();
const selectedTab = ref("chat"); // Default selected tab
const filters = useState("leadsFilters", () => ({
  botId: "",
  q: undefined,
  // from: undefined,
  // to: undefined,
  period: "all-time",
  status: "",
  channel: "all",
  action: "",
  page: "1",
  limit: "10",
  country: "all",
  type: "chat",
}));

watchEffect(() => {
  if (filters.value.period !== "custom") {
    delete filters.value.from;
    delete filters.value.to;
  }
  if (filters.value.botId === "all") filters.value.botId = "";
});

watch(
  () => filters.value.page,
  (newPage) => {
    currentPage.value = newPage; // Save page number globally
});
const exportFilters = computed(() => {
  const { page, limit, ...restFilters } = filters.value; // Destructure to exclude 'page' and 'limit'
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
      filters.value.page = '1';
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
      if (filters.value.type === "chat") {
        mergedObject = {
          name: lead.botUser?.name ?? "---",
          email: lead.botUser?.email ?? "---",
          mobile: lead?.botUser?.mobile ?? "---",
          countryCode: lead?.botUser?.countryCode ?? "+91",
          visitedStatus:
            Number(lead?.botUser?.visitedCount) > 1 ? "Revisited" : (lead.status === "junk") ? "Junk" : "New",
          botName: lead.bot.name ?? "---",
          country: lead.chat?.metadata?.country ?? "---",
          createdAt: format(lead?.createdAt, "MMMM d, yyyy"), // format(lead.botUser?.createdAt, "MMMM d, yyyy")
          // ClientId: lead.botUser.id,
        };
      } else {
        mergedObject = {
          name: lead.name ?? "---",
          phone: lead?.phone ?? "---",
          location: lead?.location ?? "---",
          createdAt: format(lead.createdAt, "MMMM d, yyyy"),
          scheduledDate: lead?.scheduledDate ? format(lead.scheduledDate, "MMMM d, yyyy") : "---",
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
const handleClearFilters = () => {
  Object.assign(filters.value, {  // Update properties directly
    botId: "",
    q: undefined,
    from: undefined,
    to: undefined,
    period: "all-time",
    status: "",
    channel: "all",
    action: "",
    page: "1",
    limit: "10",
    country: "all",
    type: selectedTab.value,
  });
};

</script>
