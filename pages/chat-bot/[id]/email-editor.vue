<template>
  <Page title="Email Configuration" :bread-crumbs="[
    { label: `${botDetails.name}`, to: `/bot-management/chat-bot/${botDetails.id}` },
  { label: 'Email Configuration', to: `/bot-management/chat-bot/${botDetails.id}/config` }
  ]">
  <div>
    <DataTable :columns="columns" :data="intentData" :page-size="8" :is-loading="false" :height="20"
      height-unit="vh" :totalCount="totalCount" :totalPageCount="totalPageCount" :page="page" />
      <CreateEditEmailConfigModal v-model="emailConfigModalState" :id="emailConfigModalState?.id" :resObject:="emailConfigModalState?.resObject"  @success="handleSuccess" />
  </div>
  </Page>
</template>
<script setup lang="ts">
import { createColumnHelper } from "@tanstack/vue-table";
import { Icon, UiButton, UiSwitch } from "#components";
import CreateEditEmailConfigModal from "~/components/bots/CreateEditEmailConfigModal.vue";

const route = useRoute();
const paramId: any = route;
const botDetails = ref(await getBotDetails(paramId.params.id));
const selectedRows = ref<string[]>([]); // Track selected rows

const filters = reactive<{
  botId: string;
  q?: string;
  from?: string;
  to?: string;
  period: string;
  status: string;
  channel: any;
  action: string;
  page: string;
  limit: string;
  country: string;
}>({
  botId: "",
  q: "crm",
  from: undefined,
  to: undefined,
  period: "",
  status: "",
  channel: "all",
  action: "",
  page: "1",
  limit: "10",
  country: "all",
});
const page = ref(0);
const totalPageCount = ref(0);
const totalCount = ref(0);
const emailConfigModalState = ref<{ open: boolean; resObject?: object | {} }>({
  open: false,
  resObject: {},
});

const columnHelper = createColumnHelper<(typeof intentData.value)[0]>();
const {
  status: intentLoadingStatus,
  refresh: intentRefresh,
  data: intentData,
} = await useLazyFetch(() => `/api/bots/${route.params.id}/intents`, {
  server: false,
  default: () => [],
  transform: (intents) =>
    intents.map((intent) => ({
      id: intent.id,
      link: intent.link,
      intent: intent.intent,
      botId: intent.botId,
      isEmailEnabled: intent.isEmailEnabled,
      emailRecipients: intent.emailRecipients ?? [],
      createdAt: formatDate(new Date(intent.createdAt), "dd.MM.yyyy"),
    })),
});

const actionsComponent = (objValue: any,) => [
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
              emailConfigModalState.value.open = true;
              emailConfigModalState.value.resObject = objValue;
            },
          },
          h(Icon, { name: "lucide:pen" }),
        ),
      h(
        UiSwitch,
        {
          color: "primary",
          class: "ml-2",
          checked: objValue.isEmailEnabled, // Bind the `checked` prop to the current value
          "onUpdate:checked": async (newValue) => {
            objValue.isEmailEnabled = newValue;
            await updateEmailConfig(objValue)
            // await intentRefresh()
          },
        },
      ),
    ],
  ),
];

const columns = [
  columnHelper.accessor("intent", {
    header: "Intent Name",
  }),
  columnHelper.accessor("link", {
    header: "Link",
    cell: (info) => info.getValue() || "--",
  }),
  columnHelper.accessor("createdAt", {
    header: "Date Created",
  }),
  columnHelper.accessor("actions", {
    header: "actions",
    cell: ({ row }) => {
      return actionsComponent(row.original);
    },
  }),
];
const toggleAllRows = (checked: boolean, allRowIds: string[]) => {
  selectedRows.value = checked ? allRowIds : [];
};

const handleSuccess = () => {
  emailConfigModalState.value.open = false;
  intentRefresh()
}

</script>