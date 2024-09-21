<template>

    <div>
      <div class="flex items-center gap-2 pb-2">
        <UiInput v-model="filters.q" @input="filters.page = '1'"
          class="max-w-[200px] focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Search role..." />
      </div>
      <DataTable @pagination="Pagination" @limit="($event) => {
        (filters.page = '1'), (filters.limit = $event);
      }
      " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns"
        :data="userDataList" :is-loading="isDataLoading" :page-size="20" :height="16" height-unit="vh" />
      <RoleManageMentModal v-model="roleModalState" @confirm="() => {
        deleterRoleState.open = false;
        roleModalState.open = false
        getAllRole()
      }
      " />
      <ConfirmationModal v-model:open="deleterRoleState.open" title="Confirm Delete"
        description="Are you sure you want to delete ?" @confirm="() => {
          if (deleterRoleState?.id) {
            deleteSingleRole({
              id: deleterRoleState.id,
              onSuccess: () => {
                 getAllRole()
              
                // getAllRole(
                // refresh();
              },
            });
            deleterRoleState.open = false;
          }
        }
        " />
    </div>
</template>
<script setup lang="ts">
import { Icon, UiBadge, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
import { useRouter, useRoute } from "vue-router";
import { campaignData } from "@/composables/useRefresh";

const rowList = reactive([
  "name",
  "email",
  "visitedCount",
  "mobile",
  "createdAt",
]);

definePageMeta({
  middleware: "admin-only",
});

const router = useRouter();
const route = useRoute();
const searchCampaign = ref("");

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
  data: userDataList,
  refresh: getAllRole,
} = await useLazyFetch("/api/user-role", {
  server: false,
  default: () => [],
  query: filters,
  headers: {
    "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  transform: (campaign: any) => {
    page.value = campaign.page;
    totalPageCount.value = campaign.totalPageCount;
    totalCount.value = campaign.totalCount;
    return campaign.data;
  },
});

const deleterRoleState = ref({ open: false, id: null });
const roleModalState = ref({ open: false, id: null });

// const userModalState = defineModel<{ open: boolean; id: any }>({
//   default: {
//     open: false,
//     id: null,
//   },
// });
// watchEffect(() => {
//   if (filters.botId === "all") filters.botId = "";
// });
// const { status, data: campaignsList,refresh: integrationRefresh, } = await useLazyFetch("/api/org/campaign", {
//   server: false,
//   default: () => [],
// });
const isDataLoading = computed(() => status.value === "pending");

const columnHelper = createColumnHelper<(typeof userDataList.value)[0]>();

const actionsComponent = (id: any) =>
  h(
    "div",
    {
      class: "flex items-center gap-2",
    },
    [
      // h(
      //   UiButton,
      //   {
      //     onClick: () => {

      //     },
      //     class: "bg-[#ffbc42] hover:bg-[#ffbc42] font-bold",
      //   },
      //   [h(Icon, { name: "ph:eye-light", class: "h-4 w-4 mr-2" }), "View"],
      // ),
      h(
        UiButton,
        {
          color: "primary",
          onClick: () => {
            roleModalState.value.open = true;
            roleModalState.value.id = id;
          }, // Add delete functionality
          class: "bg-[#f44336] hover:bg-[#f44336] font-bold", // Different color for delete
        },
        h(Icon, { name: "lucide:pen" }),
      ),
      h(
        UiButton,
        {
          variant: "destructive",
          onClick: () => {
            deleterRoleState.value.open = true;
            deleterRoleState.value.id = id;
          }, // Add delete functionality
        },
        h(Icon, { name: "lucide:trash-2" }),
      ),
    ],
  );

const columns = [

  columnHelper.accessor("name", {
    header: "Name",
  }),

  columnHelper.accessor("id", {
    header: "Action",

    cell: ({ row }) => {
      return actionsComponent(row.original.id);
    },
  }),
];
  const props =  defineProps<{ popupState?: boolean }>();
  const emit = defineEmits<{ (e: "popupState", payload:any): void }>();

watch(()=>props.popupState,(newValue:any)=>{
 roleModalState.value.open = newValue 
 roleModalState.value.id = null
})

watch(()=> roleModalState.value.open,(newValue)=>{
  if(!newValue){
    emit('popupState',roleModalState.value.open)
  }
})  
const Pagination = async ($evnt) => {
  filters.page = $evnt;
  getAllRole();
};
</script>
