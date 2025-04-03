<template>
  <Page
    :disable-elevation="true"
    title="Dashboard"
    :disableSelector="true"
    :disable-back-button="true"
    class="flex h-full flex-col items-center"
  >
    <div class="flex flex-col gap-5 p-4 sm:p-4 md:p-0">
      <QuickLinks :navigavtionList="navigavtionList" />
      <!-- <h6 class="font-bold text-[20px] mt-3">Start creating your bots</h6> -->
      <!-- <div class="flex flex-col gap-2"> -->
      <div
        class="text-[14px] font-bold text-[#3D3D3D] sm:text-[14px] md:text-[20px]"
      >
        Start creating your bots
      </div>
      <CreateBotLinks :navigavtionList="createBotNavList" />
      <div
        class="text-[14px] font-bold text-[#3D3D3D] sm:text-[14px] md:text-[20px]"
      >
        Analytics
      </div>
      <UiTabs v-model="activeTab" default-value="voice" class="w-full">
        <UiTabsList
          class="grid w-full grid-cols-2 rounded-[10px] border border-[#FFBC42] bg-[#FFF8EB] text-[#3D3D3D] sm:w-full md:w-[20%]"
        >
          <UiTabsTrigger
            value="chat"
            class="data-[state=active]:bg-[#FFBC42] data-[state=active]:text-white"
          >
            Chat
          </UiTabsTrigger>
          <UiTabsTrigger
            value="voice"
            class="data-[state=active]:bg-[#FFBC42] data-[state=active]:text-white"
          >
            Voice
          </UiTabsTrigger>
        </UiTabsList>
        <div class="mt-3 flex w-full justify-end gap-2 overflow-x-scroll">
          <span
            class="border-1 flex items-center rounded-lg border border-[#FFBC42] text-[15px]"
            style="color: rgba(138, 138, 138, 1)"
          >
            <!-- <span class="flex -items-center py-2 pl-2"></span> -->
            <span class="font-bold text-black">
              <UiSelect v-model="selectedValue" class="outline-none">
                <UiSelectTrigger
                  class="ui-select-trigger flex items-center gap-2 text-[10px] outline-none sm:w-[80px] sm:text-[10px] md:w-[230px] md:text-[14px] lg:w-[230px] lg:text-[14px] xl:w-[230px] xl:text-[14px]"
                >
                  <span class="min-w-[70px] font-thin text-gray-400">
                    Summary
                  </span>
                  <UiSelectValue />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-for="(list, index) in dateFilters"
                      :key="index"
                      class="content_align pr-2"
                      :value="list.value"
                    >
                      <div class="text-left text-[#3D3D3D]">
                        {{ list.content }}
                      </div>
                    </UiSelectItem>
                    <UiSelectItem value="custom">Custom</UiSelectItem>
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
            </span>
          </span>
          <CustomDateRangeFilter
            v-model="selectedValue"
            :selectDateField="false"
            @change="onDateChange"
          />
        </div>
        <UiTabsContent value="chat">
          <div class="pt-1 sm:pt-1 md:pt-4">
            <!-- {{ analyticsData. }} -->
            <div v-if="analyticsData?.length">
              <div
                class="xs:grid-cols-2 grid w-full grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              >
                <template v-for="statistics in analyticsData">
                  <StatsCard
                    v-if="
                      statistics.name === 'conversionRate' ||
                      statistics.name === 'uniqueVisitors' ||
                      statistics.name === 'averageSessionDuration'
                    "
                    :icon="ChatSession"
                    :title="statistics.name"
                    :count="statistics.value"
                    :loading="loading"
                  />
                  <!-- <StatusCountCard v-if="statistics" :icon="ChatSession" :title="statistics.name?.replace('_', ' ')"
                  :count="statistics.value" :loading="loading" /> -->
                </template>
              </div>
              <div class="my-6 flex w-full flex-col gap-6 md:flex-row">
                <template v-for="statistics in analyticsData">
                  <chartCard
                    v-if="statistics"
                    :icon="ChatSession"
                    :botType="activeTab"
                    :title="statistics.name"
                    :count="statistics.value"
                    :loading="loading"
                  >
                  </chartCard>
                </template>
                <!-- <template>
                  <chartCard :analyticsData="analyticsData" :icon="ChatSession" :loading="loading">
                  </chartCard>
                </template> -->
              </div>
              <div
                class="xs:grid-cols-2 grid w-full grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              >
                <template v-for="statistics in analyticsData">
                  <!-- v-if="statistics.name === 'reEngagementRate' || statistics.name === 'dropOffRate' || statistics.name === 'leadQualificationAccuracy'" -->
                  <StatsCard
                    v-if="
                      statistics.name === 'reEngagementRate' ||
                      statistics.name === 'dropOffRate' ||
                      statistics.name === 'leadQualificationAccuracy'
                    "
                    :icon="ChatSession"
                    :title="statistics.name"
                    :count="statistics.value"
                    :loading="loading"
                  />
                  <!-- <StatusCountCard v-if="statistics" :icon="ChatSession" :title="statistics.name?.replace('_', ' ')"
                  :count="statistics.value" :loading="loading" /> -->
                </template>
              </div>
            </div>
            <div
              v-if="loading && !analyticsData?.statistics?.length"
              class="xs:grid-cols-2 lg:grid-cols- grid grid-cols-2 gap-6 md:grid-cols-2"
            >
              <template v-for="n in 8" :key="n">
                <StatusCountCard
                  :title="'Loading...'"
                  :count="0"
                  :loading="loading"
                />
              </template>
            </div>
          </div>
        </UiTabsContent>
        <UiTabsContent value="voice">
          <div>
            <!-- {{ analyticsData. }} -->
            <div v-if="analyticsData?.length">
              <div
                class="xs:grid-cols-2 grid w-full grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              >
                <template v-for="statistics in analyticsData">
                  <StatsCard
                    v-if="
                      statistics.name === 'conversionRate' ||
                      statistics.name === 'uniqueVisitors' ||
                      statistics.name === 'averageSessionDuration'
                    "
                    :title="statistics.name"
                    :count="statistics.value"
                    :loading="loading"
                  />
                  <!-- <StatusCountCard v-if="statistics" :title="statistics.name?.replace('_', ' ')"
                  :count="statistics.value" :loading="loading" /> -->
                </template>
              </div>
              <div class="my-6 flex w-full flex-col gap-6 md:flex-row">
                <template v-for="statistics in analyticsData">
                  <chartCard
                    v-if="statistics"
                    :title="statistics.name"
                    :botType="activeTab"
                    :count="statistics.value"
                    :loading="loading"
                  >
                  </chartCard>
                </template>
                <!-- <template>
                  <chartCard :analyticsData="analyticsData" :loading="loading">
                  </chartCard>
                </template> -->
              </div>
              <div
                class="xs:grid-cols-2 grid w-full grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              >
                <template v-for="statistics in analyticsData">
                  <!-- v-if="statistics.name === 'reEngagementRate' || statistics.name === 'dropOffRate' || statistics.name === 'leadQualificationAccuracy'" -->
                  <StatsCard
                    v-if="
                      statistics.name === 'reEngagementRate' ||
                      statistics.name === 'dropOffRate' ||
                      statistics.name === 'leadQualificationAccuracy'
                    "
                    :title="statistics.name"
                    :count="statistics.value"
                    :loading="loading"
                  />
                  <!-- <StatusCountCard v-if="statistics" :title="statistics.name?.replace('_', ' ')"
                  :count="statistics.value" :loading="loading" /> -->
                </template>
              </div>
            </div>
            <div
              v-if="loading && !analyticsData?.statistics?.length"
              class="xs:grid-cols-2 lg:grid-cols- grid grid-cols-2 gap-6 md:grid-cols-2"
            >
              <template v-for="n in 18" :key="n">
                <StatusCountCard
                  :title="'Loading...'"
                  :count="0"
                  :loading="loading"
                />
              </template>
            </div>
          </div>
        </UiTabsContent>
      </UiTabs>
      <!-- </div> -->
      <!-- v-if="statistics" :title="statistics.name?.replace('_', ' ')"
    :count="statistics.value" :loading="loading" -->
      <!-- <h6 class="font-bold text-[20px] mt-3">Analytics</h6> -->
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
  import {
    MinusIcon,
    PlusIcon,
    DollarSign,
    UsersIcon,
    CreditCardIcon,
    ActivityIcon,
    ChartNoAxesCombined,
    Code,
    Wallet,
    MessageSquare,
    PhoneCall,
    CirclePercent,
  } from "lucide-vue-next";
  import { Line } from "vue-chartjs";
  import ChatSession from "~/components/icons/ChatSession.vue";
  import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
  import { botStore } from "~/store/botStore";
  import { useDateFilters } from "~/composables/useDateFilters";

  const config = useRuntimeConfig();

  // const organizationDetails = await $fetch("/api/org", {
  //   method: "GET",
  // });
  // const organizationId = organizationDetails?.orgDetails?.id;

  // useHead({
  //   title: "Dashboard",
  //   script: [
  //     {
  //       id: "chat-widget-script",
  //       src: `${config.public.chatBotBaseUrl}/widget.js`,
  //       type: "text/javascript",
  //       defer: true,
  //       "data-orgname": "WMS",
  //       "data-chatbotid": `${config.public.supportBotId}`,
  //       "data-orgid": `${organizationId}`,
  //     },
  //   ],
  // });
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
  );

  // Use the composable
  const { dateFilters } = useDateFilters();
  const scrapData = botStore();
  const breadcrumbStore = useBreadcrumbStore();
  const { user, refreshUser }: { user: any; refreshUser: any } =
    await useUser();
  breadcrumbStore.setBreadcrumbs([
    {
      label: "Home", // Dynamic name
      to: `/`,
    },
  ]);
  const navigavtionList = ref([
    {
      title: "Billing",
      subtitle: "Manage your plans here",
      url: "billing?type=chat",
      icon: Wallet,
    },
    {
      title: "Integrations",
      subtitle: "Manage all your integrations here",
      url: "/integration",
      icon: Code,
    },
    {
      title: "Analytics",
      subtitle: "View your stats here",
      url: "/analytics/leads",
      icon: ChartNoAxesCombined,
    },
    {
      title: "Campaign",
      subtitle: "Manage your campaigns here",
      url: "/contacts-management/campaigns",
      icon: CirclePercent,
    },
  ]);

  const createBotNavList = ref([
    {
      title: "Create a Chatbot",
      subtitle: "Click here to deploy your new chatbot",
      url: "/chat-bot/create-bot",
      icon: MessageSquare,
      type: "chat",
    },
    {
      title: "Create a Voicebot",
      subtitle: "Click here to deploy your new voicebot",
      url: "/voice-bot",
      icon: PhoneCall,
      type: "voice",
    },
  ]);

  const activeTab = ref("chat");

  const selectedValue: any = ref("last-30-days");
  const analyticsData = ref();
  const analyticsChartData = ref();
  const loading = ref(true);

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
    type: string;
  }>({
    from: undefined,
    to: undefined,
    period: "last-30-days",
    type: activeTab.value,
  });
  // const getButtonName = ref("Get Started");

  watch(
    [selectedValue, chartValues, activeTab],
    async ([period, chartValues, type]) => {
      // filter.graphValues = chartValues?.join(",");
      console.log("type", type);
      filter.type = type;
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
          value: value,
        }));
        // responseFormat(JSON.parse(JSON.stringify(data)))
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        loading.value = false;
      }
      // analyticsData.value = data;
    },
    { deep: true },
  );
  // watch(() => activeTab.value,(newType) => {
  //   console.log(newType,'sada'),
  //   filter.type = newType;
  //   // console.log(newType
  // })

  onMounted(async () => {
    try {
      await refreshUser();
      const data = await getAnalyticsData(filter);
      // Convert object to an array of objects with name and value
      analyticsData.value = Object.entries(data).map(([key, value]) => ({
        name: key,
        value: value,
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
      analyticsData.value = analyticsData.value = Object.entries(data).map(
        ([key, value]) => ({
          name: key,
          value: value,
        }),
      );
    }
  };
</script>
<style scoped>
  .focus\:ring-offset-2:focus {
    --tw-ring-offset-width: none;
  }
</style>
