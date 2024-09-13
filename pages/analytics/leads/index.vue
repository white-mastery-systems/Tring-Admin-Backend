<template>
  <Page title="Leads" :disableSelector="false" :disable-back-button="true">
    <div class="flex items-center justify-between gap-2 overflow-x-scroll pb-4">
      <div class="flex items-center gap-2">
        <UiInput
          v-model="filters.q"
          class="max-w-[130px] focus-visible:ring-0 focus-visible:ring-offset-0 sm:max-w-[130px] md:max-w-[200px] lg:max-w-[200px] xl:max-w-[200px]"
          placeholder=" Search Leads..."
        />
        <BotFilter v-model="filters.botId" />
        <StatusFilter @change="onStatusChange" />
        <!-- <ActionFilter @changeAction="onActionChange" /> -->
        <DateRangeFilter @change="onDateChange" />
      </div>

      <UiButton @click="exportToCSV" color="primary"> Export As CSV </UiButton>
    </div>
    <UiTabs default-value="all" class="w-full self-start">
      <UiTabsList class="grid w-[295px] grid-cols-3">
        <UiTabsTrigger value="all" @click="selectedChannel('all')">
          All
        </UiTabsTrigger>
        <UiTabsTrigger value="website" @click="selectedChannel('website')">
          Website
        </UiTabsTrigger>
        <UiTabsTrigger value="whatsapp" @click="selectedChannel('whatsapp')">
          WhatsApp
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="all">
        <DataTable
          :data="leads"
          :is-loading="isDataLoading"
          :columns="columns"
          :page-size="8"
          :height="14"
          height-unit="vh"
          @row-click="
            (row: any) => {
              navigateTo(`leads/${row.original.chatId}`);
            }
          "
        />
      </UiTabsContent>
      <UiTabsContent value="whatsapp">
        <DataTable
          :data="leads"
          :is-loading="isDataLoading"
          :columns="columns"
          :page-size="8"
          :height="14"
          height-unit="vh"
          @row-click="
            (row: any) => {
              navigateTo(`leads/${row.original.chatId}`);
            }
          "
        />
      </UiTabsContent>
      <UiTabsContent value="website">
        <DataTable
          :data="leads"
          :is-loading="isDataLoading"
          :columns="columns"
          :page-size="8"
          :height="14"
          height-unit="vh"
          @row-click="
            (row: any) => {
              navigateTo(`leads/${row.original.chatId}`);
            }
          "
        />
      </UiTabsContent>
    </UiTabs>
  </Page>
</template>
<script setup lang="ts">
  import { Icon, UiBadge, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";
  import { useRoute, useRouter } from "vue-router";

  const rowList = reactive([
    "name",
    "email",
    "visitedCount",
    "mobile",
    "createdAt",
  ]);

  definePageMeta({
    middleware: "admin-only",
  });

  const router = useRouter();
  const route = useRoute();

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
              let cellValue = lead.botUser[col];
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

  const params =  ref('/api/org/leads?page=2&limit=8')
  const { status, data: leads, refresh:getAllleads } = await useLazyFetch(params.value, {
    server: false,
    query: filters,
    headers: {
      "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
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
    if (value.from && value.to) {
      filters.from = value.from;
      filters.to = value.to;
    } else {
      delete filters.from;
      delete filters.to;
      filters.period = value;
    }
  };
  const onActionChange = (value: any) => {
    if (value) {
      filters.action = value;
    }
  };
  const onStatusChange = (value: any) => {
    if (value) {
      filters.status = value;
    }
  };

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
            ...(row.original.status === "junk"
              ? { class: "bg-red-200 text-red-500 hover:bg-300" }
              : Number(row.original.botUser?.visitedCount) > 1
                ? { class: "bg-[#424bd1] text-[#ffffff] hover:bg-[#424bd1]" }
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
      cell: ({ row }) => `${row.original.createdAt}`,
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
  const selectedChannel = (value: any) => {
    if (value) {
      filters.channel = value;
    }
  };
</script>
