<template>
  <Page title="Leads" :disableSelector="false" :disable-back-button="true">
    <div class="flex items-center justify-between gap-2 overflow-x-scroll pb-4">
      <div class="flex items-center gap-2">
        <UiInput v-model="filters.q"
          class="max-w-[130px] sm:max-w-[130px] md:max-w-[200px] lg:max-w-[200px] xl:max-w-[200px]  focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder=" Search Leads..." />
        <BotFilter v-model="filters.botId" />
        <StatusFilter @change="onStatusChange" />
        <DateRangeFilter @change="onDateChange" />
      </div>
      <UiButton @click="exportToCSV" color="primary"> Export As CSV </UiButton>
    </div>
    <DataTable
      :data="leads"
      :is-loading="isDataLoading"
      :columns="columns"
      :page-size="8"
      :height="73"
      height-unit="vh"
      @row-click="
        (row: any) => {
          console.log({ row });
          navigateTo(`leads/${row.original.chatId}`);
        }
      "
    />
  </Page>
</template>
<script setup lang="ts">
  import { Icon, UiBadge, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";

  definePageMeta({
    middleware: "admin-only",
  });
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
          columns
            .map((col) => {
              console.log({ col });
              let cellValue = lead[col.accessorKey];

              // Escape commas and quotes
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
    period: any;
    status: any;
  }>({
    botId: "",
    q: undefined,
    from: undefined,
    to: undefined,
    period: undefined,
    status: undefined,
  });

  const selectedDate = ref('Today')

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

  const onDateChange = (value: any) => {
    console.log("from index", { value });
    if (value.from && value.to) {
      filters.from = value.from;
      filters.to = value.to;
    } 
    else {
      delete filters.from
      delete filters.to
      filters.period = value
    }
  };
const onStatusChange = (value: any) => {
  if (value) {
    filters.status = value
  }
}

  const columnHelper = createColumnHelper<(typeof leads.value)[0]>();
  const columns = [
    columnHelper.accessor("botUser.name", {
      header: "Lead Name",
    }),
    columnHelper.accessor("botUser.email", {
      header: "Lead Email",
    }),

    columnHelper.accessor("botUser", {
      header: "Visiting Status",
      cell: ({ row }) =>
        h(
          UiBadge,
          {
            ...(Number(row.original.botUser?.visitedCount) > 1 ||
            row.original.status === "junk"
              ? { variant: "destructive" }
              : { class: "bg-green-200 text-green-500 hover:bg-green-300" }),
          },
          row.original.status === "junk"
            ? "Junk"
            : Number(row.original.botUser.visitedCount) > 1
              ? "Revisited"
              : "New",
        ),
    }),

    columnHelper.accessor("botUser.mobile", {
      header: "Lead Phone",
    }),
    columnHelper.accessor("bot.name", {
      header: "Bot Name",
    }),
    columnHelper.accessor("createdAt", {
      header: "Date Created",
      cell: ({ row }) =>
        formatDate(new Date(row.original.createdAt), "dd.MM.yyyy"),
    }),
    columnHelper.accessor("id", {
      header: "Action",
      cell: ({ row }) =>
        h(
          UiButton,
          {
            onClick: () => viewLead(row.original.chatId),
            class: "bg-[#ffbc42] hover:bg-[#ffbc42] font-bold",
          },
          [h(Icon, { name: "ph:eye-light", class: "h-4 w-4 mr-2" }), "View"],
        ),
    }),
  ];
</script>