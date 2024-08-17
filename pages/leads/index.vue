<template>
  <div class="bot-manage-main-container">
    <div class="header-align">
      <div class="flex items-center">
        <span class="text-[20px] font-bold">Leads</span>
      </div>
    </div>
    <!-- <div class="document-align gap-4">
      
      </div>
    </div> -->
    <div class="bot-main-align max-h-[80vh] overflow-y-scroll px-4 pb-4">
      <div class="flex items-center justify-between gap-2 pb-4">
        <div class="flex items-center gap-2">
          <UiInput
            v-model="searchBot"
            class="max-w-[200px]"
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
      
        <div class="count-align gap-3">
          <span class="font-bold">
            Total Chats:
            <span style="color: rgba(66, 75, 209, 1)">{{
              analyticsData?.chats
            }}</span>
          </span>
          <span class="font-bold">
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
  </div>
</template>
<script setup lang="ts">
  import { Icon, UiButton } from "#components";
  import { RangeCalendar } from "@/components/ui/range-calendar";
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

  .bot-manage-main-container {
    padding: 0 25px 0 25px;
  }

  .header-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: segoe UI Regular;
    padding-bottom: 20px;
    border-bottom: 0.5px solid rgba(181, 181, 181, 1);
  }

  .bot-main-align {
    padding: 20px;
    margin-top: 30px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    /* overflow-y: scroll; */
  }

  .content-align {
    /* width: 100px !important; */
    margin-bottom: 5px;
    /* color: rgba(138, 138, 138, 1); */
  }

  .list-header-align {
    padding: 10px 30px;
    display: flex;
    /* justify-content: space-between; */
    width: 100%;
    /* gap: 100px; */
    border-bottom: 0.5px solid rgba(181, 181, 181, 1);
  }

  .list_align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    /* background: rgba(255, 255, 255, 1); */
    /* padding: 30px 30px; */
    /* box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important; */
    border-radius: 10px;
    /* gap: 100px; */
    /* margin: 10px 0; */
  }

  .bot-list-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 1);
    padding: 20px 0px;
    width: 100% !important;
    /* height: calc(100vh - 260px); */
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
    margin: 20px 0 0 0;
    font-size: 15px;
  }

  .acive_class {
    display: flex;
    align-items: center;
    color: rgba(26, 187, 0, 1);
    gap: 5px;
    padding-inline-end: 93px;
  }

  .deacive_class {
    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(255, 0, 0, 1);
    padding-right: 77px;
  }

  .process_class {
    display: flex;
    align-items: center;
    color: rgba(238, 186, 1, 1);
    gap: 5px;
    padding-inline-end: 65px;
  }

  .process-circle-align {
    display: flex;
    align-items: center;
    background: rgba(238, 186, 1, 1);
    width: 5px;
    height: 5px;
  }

  .active-circle-align {
    display: flex;
    align-items: center;
    background-color: rgba(26, 187, 0, 1);
    width: 5px;
    height: 5px;
  }

  .deactive-circle-align {
    display: flex;
    align-items: center;
    background-color: rgba(255, 0, 0, 1);
    width: 5px;
    height: 5px;
  }

  .header-content-align {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .user_name_align {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    padding-inline-start: 30px;
  }

  .bot_name_align {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    padding-inline-start: 21px;
  }

  .create_at-align {
    padding-inline-end: 122px;
  }

  .document-align {
    display: flex;
    align-items: center;
    justify-content: end;
    margin-top: 20px;
    padding-inline-end: 10px;
  }

  .upload-document-align {
    color: rgba(66, 75, 209, 1);
    font-size: 15px;
    text-decoration: underline;
  }

  .only-content-align {
    color: rgba(138, 138, 138, 1);
    font-size: 11px;
  }

  .content-scroll-align {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: calc(100vh - 285px);
    overflow-y: scroll;
    padding: 5px;
  }

  .count-align {
    display: flex;
    align-items: center;
    padding-right: 10px;
    /* justify-content: end; */
  }

  .user_name_align {
    padding-inline-start: 22px;
  }

  .bot_name_align {
    /* padding-inline-end: 20px; */
  }

  .view_align {
    padding-right: 24px;
    cursor: pointer;
  }

  .right-dropdown-align {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 1);
    padding: 0px 10px;
    width: 150px !important;
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
  }

  .calender-align {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 40px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
  }
</style>
