<template>
  <Page title="Integration" :disable-back-button="true" :disable-elevation="false">
    <template #actionButtons>
      <div class="flex gap-2">
        <UiButton color="primary" :disabled="shouldDisableButton"
          class="text-[10.5px] sm:text-[10.5px] md:text-[14px] lg:text-[14px] xl:text-[14px]" @click="() => {
              if (route.query.q === 'number') {
                numberModalState = true;
                return;
              } if (route.query.q === 'TTS') {
                ttsModalState = true;
                return;
              }
              integrationModalState = true;
            }
            ">
          Add
          {{
          (() => {
          if (route.query.q === "TTS") {
          return "TTS Integration";
          }
          else if (route.query.q === "number") {
          return "Cloud Telephony";
          } else if (route.query.q === "crm") {
          return "CRM";
          } else if (route.query.q === "communication") {
          return "Communication";
          } else if (route.query.q === "ecommerce") {
          return "E-Commerce";
          } else {
          return "CRM";
          }
          })()
          }}
          Channel
        </UiButton>
      </div>
    </template>
    <UiTabs :default-value="route?.query?.q ?? 'crm'" class="w-full self-start">
      <UiTabsList
        class="grid w-[100%] grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 sm:w-[100%] md:w-[80%] lg:w-[70%] xl:w-[60%] h-[10%]">
        <UiTabsTrigger value="crm" @click="navigateToTab('crm')">

          CRM
        </UiTabsTrigger>
        <UiTabsTrigger value="communication" @click="navigateToTab('communication')">
          Communication
        </UiTabsTrigger>
        <UiTabsTrigger value="ecommerce" @click="navigateToTab('ecommerce')">
          E-Commerce
        </UiTabsTrigger>
        <UiTabsTrigger value="number" @click="navigateToTab('number')">
          Cloud Telephony
        </UiTabsTrigger>
        <UiTabsTrigger value="TTS" @click="navigateToTab('TTS')">
          TTS Integration
        </UiTabsTrigger>
      </UiTabsList>
      <UiTabsContent value="crm">
        <IntegrationTable :integrationModalState="integrationModalState"
          :findTitleForIntegrationModal="findTitleForIntegrationModal()" :chatIntelligence="chatIntelligence"
          @stateControl="integrationModalState = $event" />
      </UiTabsContent>
      <UiTabsContent value="communication">
        <IntegrationTable :integrationModalState="integrationModalState" :chatIntelligence="chatIntelligence"
          :findTitleForIntegrationModal="findTitleForIntegrationModal()"
          @stateControl="integrationModalState = $event" />
      </UiTabsContent>
      <UiTabsContent value="ecommerce">
        <IntegrationTable :integrationModalState="integrationModalState" :chatIntelligence="chatIntelligence"
          :findTitleForIntegrationModal="findTitleForIntegrationModal()"
          @stateControl="integrationModalState = $event" />
      </UiTabsContent>
      <UiTabsContent value="number">
        <NumberIntegration :integrationModalState="numberModalState"
          :findTitleForIntegrationModal="findTitleForIntegrationModal()" @stateControl="numberModalState = $event" />
      </UiTabsContent>
      <UiTabsContent value="TTS">
        <TTSIntegration :integrationModalState="ttsModalState"
          :findTitleForIntegrationModal="findTitleForIntegrationModal()" @stateControl="ttsModalState = $event" />
      </UiTabsContent>
    </UiTabs>
    <ChannelModal v-model="channelModalState" @success="() => {
      console.log('on success')
    }" />
  </Page>
</template>
<script lang="ts" setup>
import { Icon, UiBadge, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
import { useRoute, useRouter } from "vue-router";
import Page from "~/components/Page.vue";
import IntegrationTable from "~/components/settings/integrations/IntegrationTable.vue";
import ChannelModal from "./ChannelModal.vue";
import NumberModal from "./NumberModal.vue";
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
import TTSModal from "./TTSModal.vue";


definePageMeta({
  middleware: "user",
});

useHead({
  title: "Settings | Integrations",
});
const breadcrumbStore = useBreadcrumbStore();
const router = useRouter();
const route = useRoute();
function findTitleForIntegrationModal() {
  if (route.query.q === "TTS") {
    return "TTS Integration";
  } if (route.query.q === "number") {
      return "Cloud Telephony";
  } else if (route.query.q === "crm") {
    return "CRM";
  } else if (route.query.q === "communication") {
    return "Communication";
  } else if (route.query.q === "ecommerce") {
    return "E-Commerce";
  }
}
const integrationModalState = ref(false)
const channelModalState = ref({ open: false, id: null });
const numberModalState: any = ref(false);
const ttsModalState = ref(false);
const planDetails = ref([])

const deleteIntegrationState = ref({
  open: false,
  id: null,
});
const deleteExoPhoneState = ref({
  open: false,
  id: null,
});
const page = ref("1");
const limit = ref("10");

breadcrumbStore.setBreadcrumbs([
  {
    label: "Integration", // Dynamic name
    to: `/integration`,
  }
]);
const actionsComponent = (id: any) =>
  h(
    "div",
    {
      class: "flex items-center gap-2",
    },
    [
      h(
        UiButton,
        {
          color: "primary",
          class: "ml-2",
          onClick: () => {
            integrationModalState.open = true;
          },
        },
        h(Icon, { name: "lucide:pen" }),
      ),
      h(
        UiButton,
        {
          class: "",
          variant: "destructive",
          onClick: () => {
            deleteIntegrationState.value.id = id;
            deleteIntegrationState.value.open = true;
          },
        },
        h(Icon, { name: "lucide:trash-2" }),
      ),
    ],
  );

const statusComponent = (status: string) => {
  return h(
    UiBadge,
    {
      ...(status === "pending"
        ? { variant: "destructive" }
        : { class: "bg-green-200 text-green-500 hover:bg-green-300" }),
    },
    status,
  );
};
const columnHelper = createColumnHelper<any>();

onMounted(async () => {
  planDetails.value = await userPlan();
})

const chatIntelligence = computed(() => {
  return planDetails.value.userPlanDetails.some((plan: any) => {
    return plan.type === 'chat' && plan.planCode === 'chat_intelligence'
  });
});

const shouldDisableButton = computed(() => {
  // Only disable if it's not number or TTS AND chatIntelligence is true
  return route.query.q !== 'number' && route.query.q !== 'TTS' && chatIntelligence.value;
});
const navigateToTab = async (tab: any) => {
  page.value = "1";
  limit.value = "10";
  router.push({ query: { q: tab } });
};
</script>
