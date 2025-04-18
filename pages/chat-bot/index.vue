<template>
  <Page title="Chatbot" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4">
        <UiButton color="primary" class="text-[14px] font-medium" @click="addNewChatBot()">
          Add Chat Bot
        </UiButton>
      </div>
    </template>
    <div class="flex items-center gap-2 overflow-x-scroll mt-2">
      <UiInput v-model="filters.q" @input="filters.page = '1'"
        class="min-w-[130px] max-w-[130px] focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Search bot..." />
      <BotStatusFilter v-model="filters.active" />
      <BotCategoryFilter v-model="filters.type" />
      <UiButton color="primary" @click="handleClearFilters" class="ml-2 text-[#ffffff]">
        Clear Filters</UiButton>
    </div>
    <DataTable @row-click="handleRowClick" @pagination="Pagination" @limit="($event) => {
      (filters.page = '1'), (filters.limit = $event);
    }
    " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns" :data="bots"
      :page-size="20" :is-loading="isDataLoading" :height="16" height-unit="vh" />
  </Page>
  <AddChatBotModal v-model="agentModalState" @confirm="() => {
    agentModalState.open = false;
  refresh();
  }
  "></AddChatBotModal>
</template>

<script setup lang="ts">
import { Icon, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
import { useState } from "#app";
import { useRouter } from "vue-router";
import { useBotType } from "~/composables/botManagement/chatBot/useBotType";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
import { useBotList } from "~/composables/botManagement/chatBot/useBotList";
import { useBotFilters } from "~/composables/botManagement/chatBot/useBotFilters";

definePageMeta({
  middleware: "user",
});
useHead({
  title: "Bot Management | Chatbot",
});
const router = useRouter()
const breadcrumbStore = useBreadcrumbStore();

breadcrumbStore.setBreadcrumbs([
  {
    label: "Chatbot", // Dynamic name
    to: `/chat-bot`,
  },
]);

const searchBot = ref("");
const agentModalState = ref({ open: false, id: null });
const { filters } = useBotFilters();
const { botListStatus, bots, refresh, page, totalPageCount, totalCount } = useBotList();

const isDataLoading = computed(() => botListStatus.value === "pending");

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

  refresh();
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
  console.log('chat click',row.original.id)
  // await navigateTo(`/chat-bot/${row.original.id}`);
  await navigateTo({
    name: "chat-bot-id",
    params: { id: row.original.id },
  });
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
const addNewChatBot = async () => {
  try {
    const getSingleBotDetails = await $fetch("/api/bots", {
      method: "POST",
      body: {},
    });

    if (getSingleBotDetails?.id) {
      navigateTo(`chat-bot/create-bot/${getSingleBotDetails?.id}`);
    } else {
      // Handle case where no ID is returned
      console.error("No bot ID received from the server");
      // Optionally, show a user-friendly error message
    }
  } catch (error) {
    toast.error(error.statusMessage)
  }
};
</script>
