<template>
  <Page title="Email Template Configuration" :bread-crumbs="[
    { label: `${botDetails.name}`, to: `/bot-management/chat-bot/${botDetails.id}` },
  { label: 'Email Template Configuration', to: `/bot-management/chat-bot/${botDetails.id}/config` }
  ]">
    <!-- <div>{{ config.public.adminUrl }} || sdfsf</div> -->
    <div>
      <DataTable :columns="columns" :data="integrationsData" :page-size="8" :is-loading="false" :height="20"
        height-unit="vh" :totalCount="totalCount" :totalPageCount="totalPageCount" :page="page" />
    </div>
  </Page>
</template>
<script setup lang="ts">
import { createColumnHelper } from "@tanstack/vue-table";
import { Icon, UiButton, UiSwitch } from "#components";

const columnHelper = createColumnHelper<any>();
const route = useRoute("bot-management-chat-bot-id-config");
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
let page = ref(0);
let totalPageCount = ref(0);
let totalCount = ref(0);

const integrationsData = ref([
  // {
  //   id: 1,
  //   integration: "testing",
  //   connected: 'safafsadsa',
  //   status: true,
  // }, {
  //   id: 2,
  //   integration: "testing1",
  //   connected: 'dvadvdsvcdsv',
  //   status: true,
  // },
])
// const {
//   status,
//   data: integrationsData,
//   refresh: integrationRefresh,
// } = await useLazyFetch(`/api/bots/${route.params.id}/integrations`, {
//   server: false,
//   query: filters,
//   default: () => [],
//   transform(data) {
//     page.value = data.page;
//     totalPageCount.value = data.totalPageCount;
//     totalCount.value = data.totalCount;
//     return data.data;
//   }
// });

const actionsComponent = (value: any, id: any) => [
  h(
    "div",
    {
      class: "flex items-center gap-2",
    },
    [
      h(
        UiSwitch,
        {
          color: "primary",
          class: "ml-2",
          checked: value, // Bind the `checked` prop to the current value
          "onUpdate:checked": (newValue) => {
            // Update the specific item's status in integrationsData
            // const item = integrationsData.value.find((item) => item.id === id);
            // if (item) {
            //   item.status = newValue;
            // }
          },
          onClick: ($event) => {
            console.log($event.target, 'asdsadsad');
            // crmConfigModalState.value.open = true;
            // crmConfigModalState.value.id = id;
          },
        },
        h(Icon, { name: "lucide:pen" }),
      ),
    ],
  ),
];
const columns = [
  {
    id: "select",
    header: () => {
      const allRowIds = data.map(row => row.id); // Replace 'data' with your table data array
      const isAllSelected = allRowIds.every(id => selectedRows.value.includes(id));

      return h("input", {
        type: "checkbox",
        checked: isAllSelected,
        onChange: (event: Event) => {
          toggleAllRows((event.target as HTMLInputElement).checked, allRowIds);
        },
      });
    },
    cell: ({ row }) => {
      const rowId = row.original.id;
      return h("input", {
        type: "checkbox",
        checked: isRowSelected(rowId),
        onChange: (event: Event) => {
          const checked = (event.target as HTMLInputElement).checked;
          if (checked) {
            selectedRows.value.push(rowId);
          } else {
            selectedRows.value = selectedRows.value.filter(id => id !== rowId);
          }
        },
      });
    },
  },
  columnHelper.accessor("integration", {
    header: "Intent Name",
  }),

  columnHelper.accessor("connected", {
    header: "Template",
  }),
  columnHelper.accessor("actions", {
    header: "actions",
    cell: ({ row }) => {
      // console.log(row.original.status, "row.original -- row.original");
      return actionsComponent(row.original.status, row.original.id);
    },
  }),
];
const toggleAllRows = (checked: boolean, allRowIds: string[]) => {
  selectedRows.value = checked ? allRowIds : [];
};

</script>