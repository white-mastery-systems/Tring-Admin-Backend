<template>
  <Page title="Leads" :disableSelector="false" :disable-back-button="true">
    <div class="flex items-center justify-between gap-2 pb-4">
      <div class="flex items-center gap-2">
        <!-- <UiInput
          v-model="filters.lead"
          class="max-w-[130px] sm:max-w-[130px] md:max-w-[200px] lg:max-w-[200px] xl:max-w-[200px]"
          placeholder="Search Leads..."
        /> -->
        <BotFilter v-model="filters.botId" />
        <DateRangeFilter @change="onDateChange" />
      </div>
    </div>
    <DataTable
      :data="leads"
      :is-loading="isDataLoading"
      :columns="columns"
      :page-size="8"
      @row-click="
        (row: any) => {
          console.log({ row });
          navigateTo(`/leads/${row.original.chatId}`);
        }
      "
    />
  </Page>
</template>
<script setup lang="ts">
  import { Icon, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";

  definePageMeta({
    middleware: "admin-only",
  });

  const filters = reactive<{
    botId: string;
    lead?: string;
    from?: string;
    to?: string;
  }>({
    botId: "",
    lead: undefined,
    from: undefined,
    to: undefined,
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
      name: "leads-id",
      params: { id: chatId },
    });
  };

  const onDateChange = (value: { from: string; to: string }) => {
    console.log("from index", { value });
    filters.from = value.from;
    filters.to = value.to;
  };

  const columnHelper = createColumnHelper<(typeof leads.value)[0]>();
  const columns = [
    columnHelper.accessor("botUser.name", {
      header: "Lead Name",
    }),
    columnHelper.accessor("botUser.email", {
      header: "Lead Email",
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

<style scoped>
  .focus\:ring-offset-2:focus {
    --tw-ring-offset-width: none;
  }

  /* .bot-manage-main-container {
  padding: 0 25px 0 25px;
} */

  .header-align {
    font-family: segoe UI Regular;
    /* padding-bottom: 20px;
  border-bottom: 0.5px solid #b5b5b5; */
  }
</style>
