<template>
  <Page title="Voice Bot" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4">
        <UiButton v-if="route.query.q === 'agents'" color="primary" @click="agentModalState.open = true">
          Add Voice Bot
        </UiButton>
        <!-- <div v-else-if="route.query.q === 'campaigns'" class="flex gap-2">
          <UiButton color="primary" @click="campaignModalState.open = true">
            Add Campaign
          </UiButton>
          <UiButton class="bg-[#43D371] hover:bg-[#43D371]/90">
            Import
          </UiButton>
          <UiButton class="bg-[#43D371] hover:bg-[#43D371]/90">
            Export
          </UiButton>
        </div>
        <div v-else class="flex gap-2">
          <UiButton color="primary" @click="bucketModalState.open = true">
            Add Bucket
          </UiButton>
          <UiButton class="bg-[#43D371] hover:bg-[#43D371]/90">
            Import
          </UiButton>
          <UiButton class="bg-[#43D371] hover:bg-[#43D371]/90">
            Export
          </UiButton>
        </div> -->
        <span v-if="false"
          class="field_shadow flex w-[200px] items-center rounded-[10px] bg-[#ffffff] px-[10px] py-0 text-[15px]"
          style="color: rgba(138, 138, 138, 1)">Summary:
          <span class="font-bold text-black">
            <!-- <template> -->
            <UiSelect v-model="selectedValue" class="outline-none">
              <UiSelectTrigger class="ui-select-trigger w-[110px] font-medium outline-none">
                <UiSelectValue />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup class="select_list_align">
                  <!-- <UiSelectLabel>Today</UiSelectLabel> -->
                  <UiSelectItem v-for="(list, index) in menuList" :key="index" class="content_align"
                    :value="list.content">
                    {{ list.content }}
                  </UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
            <!-- </template> -->
          </span></span>
      </div>
    </template>
    <UiTabs default-value="agents" class="w-full self-start">
      <UiTabsList class="grid w-[40%] grid-cols-3">
        <UiTabsTrigger value="agents" @click="navigateToTab('agents')">
          Agents
        </UiTabsTrigger>
        <UiTabsTrigger value="campaigns" @click="navigateToTab('campaigns')">
          Campaigns
        </UiTabsTrigger>
        <UiTabsTrigger value="buckets" @click="navigateToTab('buckets')">
          Buckets
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="agents">
        <div class="flex items-center gap-2 pb-2">
          <UiInput v-model="searchBot" class="max-w-[200px] focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Search bot..." />
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
          " :columns="columns" :data="!voiceBot" :page-size="20" :is-loading="isDataLoading" :height="13"
          height-unit="vh" />
      </UiTabsContent>
      <UiTabsContent value="campaigns">
        <Campaigns />
      </UiTabsContent>
      <UiTabsContent value="buckets">
        <Buckets />
      </UiTabsContent>
    </UiTabs>
    <!-- <ChannelModal /> -->
    <AgentModal v-model="agentModalState" />
    <CampaignModal v-model="campaignModalState" />
    <BucketModal v-model="bucketModalState" />
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
const campaignModalState = ref({ open: false });
const bucketModalState = ref({ open: false });
const searchBot = ref("");
const searchBotDebounce = refDebounced(searchBot, 500);
const router = useRouter();
const route = useRoute();
const activeStatus = ref("");
watch(activeStatus, async (newStatus, previousStatus) => { });
const selectedValue = ref("Today");
// const newBotName = ref("");

const menuList = ref([
  {
    content: "Today",
    value: "Today",
  },
  {
    content: "Weekly",
    value: "Weekly",
  },
  {
    content: "Monthly",
    value: "Monthly",
  },
  {
    content: "Quarterly",
    value: "Quarterly",
  },
  {
    content: "Halfyearly",
    value: "Halfyearly",
  },
  {
    content: "Yearly",
    value: "Yearly",
  },
]);
// const botList = await listApiBots();

const { status, data: voiceBot } = await useLazyFetch("/api/voicebots", {
  server: false,
  default: () => [],
  query: {
    active: activeStatus,
    q: searchBotDebounce,
  },
  transform: (voiceBot) =>
    voiceBot.map((bot) => ({
      id: bot.id,
      name: bot.name,
      status: bot.active,
      createdAt: `${format(bot.createdAt, "dd MMM yyy h:MM aa")}`,
    })),
});
const isDataLoading = computed(() => status.value === "pending");

onMounted(() => {
  if (!router.currentRoute.value.query.tab) {
    navigateToTab("agents");
  }
});
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

const navigateToTab = async (tab: any) => {
  router.push({ query: { q: tab } });
};
</script>

<style scoped></style>
