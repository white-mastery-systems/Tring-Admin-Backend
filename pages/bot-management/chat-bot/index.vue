<template>
  <Page title="Chat Bot" :disable-back-button="true">
    <CreateBot />
  </Page>
</template>

<script setup lang="ts">
import { Icon, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
import { useState } from "#app";
import { useRouter } from "vue-router";
import { useBotType } from "~/composables/botManagement/chatBot/useBotType";


definePageMeta({
  middleware: "user",
});
useHead({
  title: "Bot Management | Chat Bot",
});
const router = useRouter()

const searchBot = ref("");
const agentModalState = ref({ open: false, id: null });
const filters = useState("chatBotFilters", () => ({
  q: "",
  active: "",
  page: "1",
  limit: "10",
  type: ""
}));

let page = ref(0);
let totalPageCount = ref(0);
let totalCount = ref(0);

const {
  status,
  data: bots,
  refresh: getAllChatBot,
} = await useLazyFetch("/api/bots", {
  server: false,
  default: () => [],
  query: filters,
  headers: {
    "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  transform: (bots) => {
    page.value = bots.page;
    totalPageCount.value = bots.totalPageCount;
    totalCount.value = bots.totalCount;
    return bots.data.map((bot) => {
      return {
        id: bot.id,
        name: bot.name,
        status: bot.documentId ? true : false,
        createdAt: `${bot.createdAt}`,
        type: useBotType(bot.type as BotType),
      };
    });
  },
});
const isDataLoading = computed(() => status.value === "pending");

const statusComponent = (status: boolean) =>
  status
    ? h("span", { class: "text-green-500" }, "Active")
    : h("span", { class: "text-red-500" }, "Inactive");

const columnHelper = createColumnHelper<(typeof bots.value)[0]>();
const columns = [
  columnHelper.accessor("name", {
    header: "Bot Name",
  }),
  columnHelper.accessor("type", {
    header: "Bot Type",
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

onMounted(() => {
  resetPageForChatBot()
});

const resetPageForChatBot = () => {
  const backPath = router.options.history.state.back || "";

  if (!backPath?.startsWith("/bot-management/chat-bot/")) {
    filters.value.page = '1';
  }
};
const Pagination = async ($evnt) => {
  filters.value.page = $evnt;

  getAllChatBot();
};
const onChangeCategory = (value: any) => {
  if (value) {
    filters.value.type = value;
    filters.value.page = "1";
  }
}
const onChangeStatus = (value: any) => {
  if (value) {
    filters.value.active = value;
    filters.value.page = "1";
  }
}
const handleRowClick = async (row: any) => {
  await navigateTo(`/bot-management/chat-bot/${row.original.id}`);
}

const handleClearFilters = () => {
  Object.assign(filters.value, {  // Update properties directly
    q: "",
    active: "",
    page: "1",
    limit: "10",
    type: ""
  });
};
</script>
