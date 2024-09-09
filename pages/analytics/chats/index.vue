<template>
  <Page title="Chats" :disable-back-button="true">
    <div class="flex items-center gap-2 overflow-x-scroll pb-2">
      <div class="flex items-center gap-2">
        <UiInput
          v-model="filters.q"
          class="max-w-[130px] focus-visible:ring-0 focus-visible:ring-offset-0 sm:max-w-[130px] md:max-w-[200px] lg:max-w-[200px] xl:max-w-[200px]"
          placeholder="Search bot..."
        />
        <BotFilter v-model="filters.botId" />
        <BotUserFilter @changeAction="onActionChange" />
        <DateRangeFilter @change="onDateChange" />
      </div>
    </div>
    <DataTable
      @row-click="
        (row: any) => {
          return navigateTo(`chats/${row.original.id}`);
          //TODO change this
        }
      "
      :columns="columns"
      :data="bots"
      :page-size="20"
      :is-loading="isDataLoading"
      :height="65"
      height-unit="vh"
    />
  </Page>
</template>
<script setup lang="ts">
  import { createColumnHelper } from "@tanstack/vue-table";
  definePageMeta({
    middleware: "admin-only",
  });

  const formSchema = toTypedSchema(
    z.object({
      newBotName: z.string().min(2, "Bot Name is requird."),
    }),
  );
  const searchBot = ref("");
  // const searchBotDebounce = refDebounced(searchBot, 500);

  const activeStatus = ref("");
  watch(activeStatus, async (newStatus, previousStatus) => {});

  const filters = reactive<{
    botId: string;
    q?: string;
    from?: string;
    to?: string;
    botUserName: string;
    period: string;
  }>({
    botId: "",
    q: undefined,
    from: undefined,
    to: undefined,
    botUserName: "",
    period: "all-time",
  });
  const { status, data: bots } = await useLazyFetch("/api/chats", {
    server: false,
    query: filters,
    default: () => [],
    headers: {
      "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    transform: (chats) => {
      return chats?.map((chat) => ({
        userName: chat.botUser?.name || "No name",
        id: chat.id,
        location: `${chat.metadata?.city ?? "--"} - ${chat.metadata?.state ?? "--"} `,
        createdAt: `${chat?.createdAt}`,
        mode: chat.metadata?.mode ?? "Live",
      }));
    },
  });
  const isDataLoading = computed(() => status.value === "pending");

  const statusComponent = (status: boolean) =>
    status
      ? h("span", { class: "text-green-500" }, "Active")
      : h("span", { class: "text-red-500" }, "Inactive");

  const columnHelper = createColumnHelper<(typeof bots.value)[0]>();
  const columns = [
    columnHelper.accessor("userName", {
      header: "User Name",
    }),
    columnHelper.accessor("location", {
      header: "Location",
    }),
    columnHelper.accessor("mode", {
      header: "Mode",
    }),
    columnHelper.accessor("createdAt", {
      header: "Date Created",
    }),
  ];
  const onActionChange = (value: any) => {
    filters.botUserName = value;
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
</script>
