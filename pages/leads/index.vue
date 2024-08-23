<template>
  <Page
    title="Leads"
    :disableSelector="false"
    :disable-back-button="true"
    :disable-elevation="true"
  >
    <div class="field_shadow max-h-[80vh] overflow-y-scroll p-[20px] px-4 pb-4">
      <div class="flex items-center justify-between gap-2 pb-4">
        <div class="flex items-center gap-2">
          <UiInput
            v-model="searchBot"
            class="max-w-[130px] sm:max-w-[130px] md:max-w-[200px] lg:max-w-[200px] xl:max-w-[200px]"
            placeholder="Search Leads..."
          />
          <!-- <UiPopover>
            <UiPopoverTrigger as-child>
              <UiButton variant="outline">Search by Date</UiButton>
            </UiPopoverTrigger>
            <UiPopoverContent class="w-80">
              <RangeCalendar v-model="dateRange" class="rounded-md border" />
            </UiPopoverContent>
          </UiPopover> -->
        </div>

        <div class="flex items-center gap-3 pr-[10px]">
          <span
            class="text-[9px] font-bold sm:text-[10px] md:text-[12px] lg:text-[16px] xl:text-[16px]"
          >
            Total Chats:
            <span style="color: rgba(66, 75, 209, 1)">{{
              analyticsData?.chats
            }}</span>
          </span>
          <span class="text-[9px] font-bold md:text-[12px] lg:text-[16px]">
            Total Leads:
            <span style="color: rgba(66, 75, 209, 1)">{{
              analyticsData?.leads
            }}</span>
          </span>
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
    </div>
  </Page>
</template>
<script setup lang="ts">
  import { Icon, UiButton } from "#components";
  import { getLocalTimeZone, today } from "@internationalized/date";
  import { createColumnHelper } from "@tanstack/vue-table";
  import type { DateRange } from "radix-vue";

  definePageMeta({
    middleware: "admin-only",
  });
  const searchBot = ref("");
  const searchBotDebounced = refDebounced(searchBot, 500);

  const selectedValue = ref("Today");
  const loading = ref(true);
  const error: any = ref(null);
  // const ListLeads = ref()
  const start = today(getLocalTimeZone());
  const end = start.add({ days: 7 });

  const ListLeads = await listLeads();
  const dateRange = ref({
    start,
    end,
  }) as Ref<DateRange>;
  const dateRangeDebounced = refDebounced(dateRange, 500);
  watch(dateRangeDebounced, async (newDate, previousDate) => {
    console.log({ newDate });
  });
  const { status, data: leads } = await useLazyFetch("/api/org/leads", {
    server: false,
    query: {
      q: searchBotDebounced,
    },
    default: () => [],
  });
  const isDataLoading = computed(() => status.value === "pending");

  const analyticsData = ref();

  onMounted(async () => {
    analyticsData.value = await getAnalyticsData();
  });

  // const rep = await defineEventHandler()

  // onMounted(async() => {
  //   ListLeads.value = await listLeads()
  //   console.log(ListLeads.value, "ListLeads.value")
  // })

  const viewBot = async (chatId: any) => {
    await navigateTo({
      name: "leads-id",
      params: { id: chatId },
    });
  };

  const columnHelper = createColumnHelper<(typeof leads.value)[0]>();
  const columns = [
    columnHelper.accessor("botUser.name", {
      header: "Lead Name",
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
            onClick: () => viewBot(row.original.chatId),
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
