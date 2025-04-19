<template>
  <Page title="Voicebot" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4 overflow-auto">
        <UiButton color="primary" @click="createNewVoiceBot()">
          Add Voice Bot
        </UiButton>
      </div>
    </template>
    <div class="flex items-center gap-2 mt-2 overflow-x-scroll">
      <UiInput v-model="filters.q"
        class="min-w-[130px] max-w-[130px] focus-visible:ring-0 focus-visible:ring-offset-0 truncate"
        placeholder="Search bot" />
      <BotStatusFilter v-model="filters.active" />
      <UiButton @click="handleClearFilters" class="ml-2" color="primary">Clear Filters</UiButton>
    </div>
    <DataTable @row-click="handleRowClick" @pagination="Pagination" @limit="($event) => {
        (filters.page = '1'), (filters.limit = $event);
      }
      " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns" :data="voiceBot"
      :page-size="20" :is-loading="isDataLoading" :height="20" height-unit="vh" />
    <CreateEditVoiceBotModal v-model="agentModalState" />
    <CreateEditCampaignModal v-model="campaignModalState" @confirm="() => {
        campaignModalState.open = false;
      }
      " />
  </Page>
</template>
<script setup lang="ts">
import { createColumnHelper } from "@tanstack/vue-table";
import { useRoute, useRouter } from "vue-router";
import { useState } from "#app";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
definePageMeta({
  middleware: "user",
});
useHead({
  title: "Bot Management | Voicebot",
});

const campaignModalState = ref({ open: false, id: null });
const router = useRouter();
const route = useRoute();
const agentModalState = ref({ open: false, id: route.params.id });
const filters = useState("chatBotFilters", () => ({
  q: "",
  active: "",
  page: '1',
  limit: "10",
}));

const page = ref(0);
const totalPageCount = ref(0);
const totalCount = ref(0);
const breadcrumbStore = useBreadcrumbStore();
breadcrumbStore.setBreadcrumbs([
  {
    label: "Voicebot", // Dynamic name
    to: `/voice-bot`,
  }
]);

const {
  status,
  data: voiceBot,
  refresh: getAllvoiceBot,
} = await useLazyFetch("/api/voicebots", {
  server: false,
  default: () => [],
  query: filters,
  headers: {
    "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  transform: (voiceBot: any) => {
    page.value = voiceBot.page;
    totalPageCount.value = voiceBot.totalPageCount;
    totalCount.value = voiceBot.totalCount;
    return voiceBot.data.map((bot: any) => ({
      id: bot.id,
      name: bot.name,
      status: bot.active,
      createdAt: `${bot.createdAt}`,
    }));
  },
});
const isDataLoading = computed(() => status.value === "pending");

onMounted(() => {
  resetPageForVoiceBot()
});

const resetPageForVoiceBot = () => {
  const backPath = router.options.history.state.back || "";

  if (!backPath?.startsWith("/bot-management/voice-bot/")) {
    filters.value.page = '1';
  }
};

const statusComponent = (status: boolean) =>
  status
    ? h("span", { class: "text-green-500" }, "Active")
    : h("span", { class: "text-red-500" }, "Inactive");

const columnHelper = createColumnHelper<(typeof bots.value)[0]>();
const columns = [
  columnHelper.accessor("name", {
    header: "Bot Name",
  }),
  columnHelper.accessor("createdAt", {
    header: "Date Created",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      return statusComponent(row.original.status);
    },
  }),
];

const createNewVoiceBot = async() => {
  await navigateTo('voice-bot/create-voice-bot/')
}
const Pagination = async ($evnt) => {
  filters.value.page = $evnt;

  getAllvoiceBot();
};
const handleRowClick = async (row: any) => {
  await navigateTo({
    name: "voice-bot-id",
    params: { id: row.original.id },
  }); // Ensure it's pushing a new entry
}
const handleClearFilters = () => {
  Object.assign(filters.value, {  // Update properties directly
    q: "",
    active: "",
    page: '1',
    limit: "10",
  });
};
</script>
