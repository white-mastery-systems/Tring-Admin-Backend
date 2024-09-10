<template>
  <div>
    <div class="flex items-center gap-2 pb-2">
      <UiInput v-model="searchCampaign" class="max-w-[200px] focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Search campaign..." />
    </div>
    <DataTable :data="leads" :is-loading="isDataLoading" :columns="columns" :page-size="20" :height="14" height-unit="vh"
      @row-click="(row: any) => {
        navigateTo(`leads/${row.original.chatId}`);
      }
        " />
  </div>
</template>
<script setup lang="ts">
import { Icon, UiBadge, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
import { useRouter, useRoute } from "vue-router";

const rowList = reactive(['name', 'email', 'visitedCount', 'mobile', 'createdAt'])

definePageMeta({
  middleware: "admin-only",
});

const router = useRouter();
const route = useRoute();
const searchCampaign = ref('')

const exportToCSV = () => {
  if (leads.value.length === 0) {
    alert("No data to export");
    return;
  }

  // Create CSV content
  const csvContent =
    columns.map((col) => col.header).join(",") +
    "\n" +
    leads.value
      .map((lead) =>
        rowList
          .map((col) => {
            let cellValue = lead.botUser[col]
            if (cellValue) {
              cellValue = cellValue.toString().replace(/"/g, '""');
              if (
                cellValue.includes(",") ||
                cellValue.includes('"') ||
                cellValue.includes("\n")
              ) {
                cellValue = `"${cellValue}"`;
              }
              return cellValue;
            }
          })
          .join(","),
      )
      .join("\n");

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a download link and trigger the download
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "leads_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const filters = reactive<{
  botId: string;
  q?: string;
  from?: string;
  to?: string;
  period: string;
  status: string;
  channel: any;
  action: string;
}>({
  botId: "",
  q: undefined,
  from: undefined,
  to: undefined,
  period: "",
  status: "",
  channel: "all",
  action: "",
});

watchEffect(() => {
  if (filters.botId === "all") filters.botId = "";
});
const { status, data: leads } = await useLazyFetch("/api/org/leads", {
  server: false,
  query: filters,
  default: () => [],
});
const isDataLoading = computed(() => status.value === "pending");

const viewLead = async (chatId: any) => {
  await navigateTo({
    name: "analytics-leads-id",
    params: { id: chatId },
  });
};

const columnHelper = createColumnHelper<(typeof leads.value)[0]>();

const actionsComponent = (id: any) => h(
  "div",
  {
    class: "flex items-center gap-2",
  }, [
  h(
    UiButton,
    {
      onClick: () => viewLead(id),
      class: "bg-[#ffbc42] hover:bg-[#ffbc42] font-bold",
    },
    [h(Icon, { name: "ph:eye-light", class: "h-4 w-4 mr-2" }), "View"],
  ),
  h(
    UiButton,
    {
      onClick: () => deleteLead(id), // Add delete functionality
      class: "bg-[#f44336] hover:bg-[#f44336] font-bold", // Different color for delete
    },
    [h({ name: "ph:trash-light", class: "h-4 w-4 mr-2" }), "Configure"]
  ),
    h(
      UiButton,
      {
        onClick: () => deleteLead(id), // Add delete functionality
        class: "bg-[#f44336] hover:bg-[#f44336] font-bold", // Different color for delete
      },
      [h({ name: "ph:trash-light", class: "h-4 w-4 mr-2" }), "Delete"]
    )
]
)

const columns = [
  columnHelper.accessor("botUser.name", {
    header: "Scheduled at",
  }),
  columnHelper.accessor("botUser.email", {
    header: "Campaign Name",
  }),


  columnHelper.accessor("createdAt", {
    header: "No. of Audiences",
    cell: ({ row }) =>
      formatDate(new Date(row.original.createdAt), "dd MMM yyyy HH:MM "),
  }),
  columnHelper.accessor("id", {
    header: "Action",
    cell: ({ row }) => {
      return actionsComponent(row.original.chatId)
    }
  }),
];
</script>
