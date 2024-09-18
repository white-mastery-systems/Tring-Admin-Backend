<template>
  <Page title="Voice Bot" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4 overflow-auto">
        <UiButton color="primary" @click="agentModalState.open = true">
          Add Voice Bot
        </UiButton>
      </div>
    </template>
    <div class="flex items-center gap-2 pb-2">
      <UiInput v-model="filters.q" @input="filters.page = '1'"
        class="max-w-[200px] focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Search bot..." />
      <UiSelect v-model="activeStatus">
        <UiSelectTrigger class="max-w-[200px]">
          <UiSelectValue placeholder="Filter status" />
        </UiSelectTrigger>
        <UiSelectContent>
          <UiSelectItem value="true">Active</UiSelectItem>
          <UiSelectItem value="false">In active</UiSelectItem>
          <UiSelectItem value="all">All</UiSelectItem>
        </UiSelectContent>
      </UiSelect>
    </div>

    <DataTable @row-click="(row: any) => {
        return navigateTo(`/bot-management/voice-bot/${row.original.id}`);
      }
      " @pagination="Pagination" @limit="($event) => {
              (filters.page = '1'), (filters.limit = $event);
            }
            " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns" :data="voiceBot"
      :page-size="20" :is-loading="isDataLoading" :height="14" height-unit="vh" />
    <!-- <ChannelModal /> -->
    <AgentModal v-model="agentModalState" />
    <CampaignModal v-model="campaignModalState" @confirm="
        () => {
          campaignModalState.open = false;
        }
      " />
    <!-- <BucketModal v-model="bucketModalState" /> -->
    <!-- <AgentModal v-model="agentModalState" /> -->
  </Page>
</template>
<script setup lang="ts">
  import { createColumnHelper } from "@tanstack/vue-table";
  import { format } from "date-fns";
  import { any } from "zod";
  import { useRoute, useRouter } from "vue-router";

  definePageMeta({
    middleware: "admin-only",
  });

  const formSchema = toTypedSchema(
    z.object({
      newBotName: z.string().min(2, "Bot Name is requird."),
    }),
  );

  const agentModalState = ref({ open: false });
  const campaignModalState = ref({ open: false, id: null });

  const searchBot = ref("");
  const searchBotDebounce = refDebounced(searchBot, 500);
  const router = useRouter();
  const route = useRoute();
  const activeStatus = ref("");
  watch(activeStatus, async (newStatus, previousStatus) => {
    filters.active = newStatus;
    filters.page = "1";
  });
  const selectedValue = ref("Today");
  // const newBotName = ref("");

  // const botList = await listApiBots();

  const filters = reactive<{
    q: string;
    page: string;
    limit: string;
    active: string;
  }>({
    q: "",
    active: "",
    page: "1",
    limit: "10",
  });

  let page = ref(0);
  let totalPageCount = ref(0);
  let totalCount = ref(0);
  const {
    status,
    data: voiceBot,
    refresh: getAllvoiceBot,
  } = await useLazyFetch("/api/voicebots", {
    server: false,
    default: () => [],
    query: filters,
    headers: {
      "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    transform: (voiceBot: any) => {
      page.value = voiceBot.page;
      totalPageCount.value = voiceBot.totalPageCount;
      totalCount.value = voiceBot.totalCount;
      return voiceBot.data.map((bot: any) => ({
        id: bot.id,
        name: bot.name,
        status: bot.active,
        createdAt: `${bot.createdAt}`,
      }));
    },
  });
  const isDataLoading = computed(() => status.value === "pending");

  // onMounted(() => {
  //   if (!router.currentRoute.value.query.tab) {
  //     navigateToTab("agents");
  //   }
  // });

  const addVoiceBot = async (value: any) => {
    try {
      const bot = await $fetch("/api/voicebots", {
        method: "POST",
        body: { name: value.newBotName },
      });
      return navigateTo({
        name: "bot-management-voice-bot-id",
        params: { id: bot.id },
      });
    } catch (err: any) {
      toast.error(err.data.data[0].message);
    }
  };

  const botManagementDetails = async (list: any) => {
    return navigateTo({
      name: "bot-management-voice-bot-id",
      params: { id: list.id },
    });
  };

  const statusComponent = (status: boolean) =>
    status
      ? h("span", { class: "text-green-500" }, "Active")
      : h("span", { class: "text-red-500" }, "Inactive");

  const columnHelper = createColumnHelper<(typeof bots.value)[0]>();
  const columns = [
    columnHelper.accessor("name", {
      header: "Bot Name",
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

  const Pagination = async ($evnt) => {
    filters.page = $evnt;
    console.log(filters.page);

    getAllvoiceBot();
  };

  const navigateToTab = async (tab: any) => {
    router.push({ query: { q: tab } });
  };
</script>

<style scoped></style>