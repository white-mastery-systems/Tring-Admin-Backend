<template>
  <Page :disable-elevation="true" title="Dashboard" :disableSelector="true" :disable-back-button="true"
    class="flex flex-col items-center">
    <template #actionButtons>
      <div class="flex overflow-x-scroll gap-2 w-full justify-end">
        <span class="field_shadow flex items-center rounded-lg text-[15px]" style="color: rgba(138, 138, 138, 1)">
          <!-- <span class="flex -items-center py-2 pl-2"></span> -->
          <span class="font-bold text-black">
            <UiSelect v-model="selectedValue" class="outline-none">
              <UiSelectTrigger
                class="ui-select-trigger flex items-center gap-2 text-[10px] outline-none sm:w-[80px] sm:text-[10px] md:w-[230px] md:text-[14px] lg:w-[230px] lg:text-[14px] xl:w-[230px] xl:text-[14px]">
                <span class="min-w-[70px] font-thin text-gray-400">
                  Summary
                </span>
                <UiSelectValue />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup>
                  <UiSelectItem v-for="(list, index) in dateFilters" :key="index" class="content_align pr-2"
                    :value="list.value">
                    <div class="text-left">
                      {{ list.content }}
                    </div>
                  </UiSelectItem>
                  <UiSelectItem value="custom">Custom</UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
          </span>
        </span>
        <CustomDateRangeFilter v-model="selectedValue" :selectDateField="false" @change="onDateChange" />
      </div>
    </template>

    <QuickLinks :navigavtionList="navigavtionList" />
    <!-- <h6 class="font-bold text-[20px] mt-3">Start creating your bots</h6> -->
    <!-- <div class="flex flex-col gap-2"> -->
      <CreateBotLinks :navigavtionList="createBotNavList" />
    <!-- </div> -->
    <!-- v-if="statistics" :icon="ChatSession" :title="statistics.name?.replace('_', ' ')"
    :count="statistics.value" :loading="loading" -->
    <!-- <h6 class="font-bold text-[20px] mt-3">Analytics</h6> -->
    <div v-if="analyticsData?.length"
      class="xs:grid-cols-2 grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
      <template v-for="statistics in analyticsData">
        <StatsCard v-if="statistics" :icon="ChatSession" :title="statistics.name?.replace('_', ' ')"
          :count="statistics.value" :loading="loading" />
        <!-- <StatusCountCard v-if="statistics" :icon="ChatSession" :title="statistics.name?.replace('_', ' ')"
          :count="statistics.value" :loading="loading" /> -->
      </template>
    </div>
    <div v-if="loading && !analyticsData?.statistics?.length"
      class="xs:grid-cols-2 grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <template v-for="n in 18" :key="n">
        <StatusCountCard :icon="ChatSession" :title="'Loading...'" :count="0" :loading="loading" />
      </template>
    </div>
  </Page>
</template>
<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { MinusIcon, PlusIcon, DollarSign, UsersIcon, CreditCardIcon, ActivityIcon, ChartNoAxesCombined, Code, Wallet } from "lucide-vue-next";
import { Line } from "vue-chartjs";
import ChatSession from "~/components/icons/ChatSession.vue";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
import { botStore } from '~/store/botStore';

useHead({
  title: "Dashboard",
});
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
);

const scrapData = botStore();
const breadcrumbStore = useBreadcrumbStore();
breadcrumbStore.setBreadcrumbs([
  {
    label: "Home", // Dynamic name
    to: `/`,
  }
]);
const navigavtionList = ref([
  {
    title: "Billing",
    subtitle: "Manage your plans here",
    url: "billing?type=chat",
    icon: Wallet,
  }, {
    title: "Integrations",
    subtitle: "Manage all your integrations here",
    url: "/integration",
    icon: Code,
  }, {
    title: "Analytics",
    subtitle: "View your stats here",
    url: "/analytics/leads",
    icon: ChartNoAxesCombined,
  }, {
    title: "Campaign",
    subtitle: "Manage your campaigns here",
    url: "/contacts-management/campaigns",
    icon: '',
  },
]);

const createBotNavList = ref([
  {
    title: "Create a Chatbot",
    subtitle: "Click here to deploy your new chatbot",
    url: "/chat-bot/create-bot",
  }, {
    title: "Create a Voicebot",
    subtitle: "Click here to deploy your new voicebot",
    url: "/voice-bot",
  }
]);

const revenusList = ref([
  {
    title: "Total Revenue",
    revenus: "$45,231.89",
    previousRevenus: "+20.1% from last month",
    icon: DollarSign,
  }, {
    title: "Subscriptions",
    revenus: "+2350",
    previousRevenus: "+180.1% from last month",
    icon: UsersIcon,
  }, {
    title: "Sales",
    revenus: "+12,234",
    previousRevenus: "+19% from last month",
    icon: CreditCardIcon,
  }, {
    title: "Active Now",
    revenus: "+573",
    previousRevenus: "+201 since last host",
    icon: ActivityIcon,
  },
])
const selectedValue: any = ref("last-30-days");
const analyticsData = ref();
const analyticsChartData = ref()
const loading = ref(true);

const dateFilters = reactive([
  {
    content: "Today",
    value: "today",
  },
  {
    content: "Yesterday",
    value: "yesterday",
  },
  {
    content: "Last 7 days",
    value: "last-7-days",
  },
  {
    content: "Last 30 days",
    value: "last-30-days",
  },
  {
    content: "Current month",
    value: "current-month",
  },
  {
    content: "Last month",
    value: "last-month",
  },
  {
    content: "Current year",
    value: "current-year",
  },
  {
    content: "Last year",
    value: "last-year",
  },
  {
    content: "Current financial year",
    value: "current-financial-year",
  },
  {
    content: "Last financial year",
    value: "last-financial-year",
  },
  {
    content: "All time",
    value: "all-time",
  },
]);
const chartValues = ref(["leads", "sessions"]);
const state = reactive<{ graphData: any[]; labels: any[] }>({
  graphData: [],
  labels: [],
});

watch(analyticsData, (newValue, oldValue) => {
  if (newValue?.graph?.length > 0) {
    state.labels = newValue.graph[0]?.map((item: any) => item.date);
  }

  state.graphData = newValue.graph?.map((graphItem: any) =>
    graphItem?.map((item: any) => item.count),
  );
});

definePageMeta({
  middleware: "user",
});
const filter = reactive<{
  from?: string;
  to?: string;
  period: string;
}>({
  from: undefined,
  to: undefined,
  period: "last-30-days",
});
// const getButtonName = ref("Get Started");

watch([selectedValue, chartValues], async ([period, chartValues]) => {
  // filter.graphValues = chartValues?.join(",");

  filter.period = period;
  if (period != "custom") {
    delete filter.from;
    delete filter.to;
  }
  loading.value = true;
  try {
    if (period === "custom") return;
    const data = await getAnalyticsData(filter);
    analyticsData.value = Object.entries(data).map(([key, value]) => ({
      name: key,
      value: value
    }));
    // responseFormat(JSON.parse(JSON.stringify(data)))
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
  } finally {
    loading.value = false;
  }
  // analyticsData.value = data;
});

onMounted(async () => {
  try {
    const data = await getAnalyticsData(filter);
    // Convert object to an array of objects with name and value
    analyticsData.value = Object.entries(data).map(([key, value]) => ({
      name: key,
      value: value
    }));
  } catch (e) {
    toast.error(e?.statusMessage);
    // authHandlers.logout();
  }
  if (analyticsData.value) loading.value = false;
});

const onDateChange = async (value: any) => {
  if (value.from && value.to) {
    filter.from = value.from;
    filter.to = value.to;

    const data = await getAnalyticsData(filter);
    analyticsData.value = analyticsData.value = Object.entries(data).map(([key, value]) => ({
      name: key,
      value: value
    }));
  }
};
</script>
<style scoped>
.focus\:ring-offset-2:focus {
  --tw-ring-offset-width: none;
}
</style>
