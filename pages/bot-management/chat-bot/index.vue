<template>
  <Page title="Chat Bot" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4">
        <UiButton class="button-align bg-[#424bd1] text-[14px] font-medium hover:bg-[#424bd1] hover:brightness-95"
          @click="() => {
              agentModalState.open = true;
              agentModalState.id = null;
            }
            ">
          Add Chat Bot
        </UiButton>
      </div>
    </template>
    <div class="flex items-center gap-2 pb-2">
      <UiInput v-model="filters.q" @input="filters.page = '1'"
        class="min-w-[100px] max-w-[200px] focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Search bot..." />
      <BotStatusFilter @change="onChangeStatus" />
      <BotCategoryFilter @change="onChangeCategory" />
    </div>
    <DataTable @row-click="handleRowClick" @pagination="Pagination" @limit="($event) => {
        (filters.page = '1'), (filters.limit = $event);
      }
      " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns" :data="bots"
      :page-size="20" :is-loading="isDataLoading" :height="20" height-unit="vh" />
  </Page>
  <AddChatBotModal v-model="agentModalState" @confirm="() => {
      agentModalState.open = false;
      getAllChatBot();
    }
    "></AddChatBotModal>
</template>

<script setup lang="ts">
import { Icon, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
import { useState } from "#app";
import { useRouter } from "vue-router";


definePageMeta({
  middleware: "user",
});
useHead({
  title: "Bot Management | Chat Bot",
});
const currentPage = useState("counter", () => '1');
const router = useRouter()

const searchBot = ref("");
const agentModalState = ref({ open: false, id: null });

const filters = reactive<{
  q: string;
  page: string;
  limit: string;
  active: string;
  type: string;
}>({
  q: "",
  active: "",
  page: currentPage.value,
  limit: "10",
  type: ""
});

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
      const type = () => {
        switch (bot.type) {
          case "e-commerce":
            return "E-commerce";
          case "real-estate":
            return "Real Estate";
          case "government-sectors":
            return "Government Sectors";
          case "finance-banking":
            return "Finance & Banking";
          case "healthcare":
            return "Healthcare";
          case "energy-utilities":
            return "Energy & Utilities";
          case "telecommunications":
            return "Telecommunications";
          case "travel-hospitality":
            return "Travel & Hospitality";
          case "logistics":
            return "Logistics";
          case "education-training":
            return "Education & Training";
          case "it-service":
            return "IT Service";
          default:
            return "Other";
        }
      };
      return {
        id: bot.id,
        name: bot.name,
        status: bot.documentId ? true : false,
        createdAt: `${bot.createdAt}`,
        type: type(),
      };
    });
  },
});
const isDataLoading = computed(() => status.value === "pending");
watch(
  () => filters.page,
  (newPage) => {
    currentPage.value = newPage; // Save page number globally
  }
);

// const botManagementDetails = async (list: any) => {
//   return navigateTo({
//     name: "bot-management-chat-bot-id",
//     params: { id: list.id },
//   });
// };

// const actionsComponent = (id: any) =>
//   h(
//     "div",
//     {
//       class: "flex items-center gap-2",
//     },
//     [
//       h(
//         UiButton,
//         {
//           onClick: (e: Event) => {
//             e.stopPropagation();
//             agentModalState.value.open = true;
//             agentModalState.value.id = id;
//           },
//           color: "primary",
//         },
//         h(Icon, { name: "lucide:pen" }),
//       ),
//     ],
//   );

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
    currentPage.value = '1'; // Reset page number when revisiting
    filters.page = '1';
  }
};
const Pagination = async ($evnt) => {
  filters.page = $evnt;

  getAllChatBot();
};
const onChangeCategory = (value: any) => {
  if (value) {
    filters.type = value;
    filters.page = "1";
  }
}
const onChangeStatus = (value: any) => {
  if (value) {
    filters.active = value;
    filters.page = "1";
  }
}
const handleRowClick = async (row: any) => {
  await navigateTo(`/bot-management/chat-bot/${row.original.id}`);
}
</script>
