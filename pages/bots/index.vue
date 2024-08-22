<template>
  <!-- mt-4 -->
  <div class="py-0 sm:px-[10px] md:px-[25px] lg:px-[25px] h-full overflow-hidden">
    <div class="header-align flex items-center justify-between">
      <span class="text-[20px] font-bold">Bot Management</span>
      <div class="flex gap-4">
        <UiDialog>
          <UiDialogTrigger as-child>
            <UiButton class="button-align bg-[#424bd1] text-[14px] font-medium hover:bg-[#424bd1] hover:brightness-95">
              Add Bot
            </UiButton>
          </UiDialogTrigger>
          <UiDialogContent>
            <UiDialogHeader>
              <UiDialogTitle>Add a New Bot</UiDialogTitle>
            </UiDialogHeader>
            <UiForm :validation-schema="formSchema" :keep-values="true" :validate-on-mount="false"
              class="mb-4 space-y-6" @submit="addBot">
              <UiFormField v-slot="{ componentField }" name="newBotName">
                <UiFormItem class="w-full">
                  <UiFormLabel class="font-bold">Bot Name</UiFormLabel>
                  <UiFormControl>
                    <UiInput v-bind="componentField" class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium"
                      placeholder="Enter Bot Name" type="text" />
                  </UiFormControl>
                  <UiFormMessage />
                </UiFormItem>
              </UiFormField>
              <div class="w-full flex justify-end items-center">
                <UiButton type="submit"
                  class="mt-4 w-1/2 self-end bg-[#424bd1] text-white hover:bg-[#424bd1] hover:brightness-90">
                  Create
                </UiButton>
              </div>
            </UiForm>
          </UiDialogContent>
        </UiDialog>
        <span v-if="false"
          class="flex items-center bg-[#ffffff] py-0 px-[10px] w-[200px] rounded-[10px] text-[15px] field_shadow"
          style="color: rgba(138, 138, 138, 1)">Summary:
          <span class="font-bold text-black">
            <!-- <template> -->
            <UiSelect v-model="selectedValue" class="outline-none">
              <UiSelectTrigger class="ui-select-trigger font-medium w-[110px] outline-none">
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
    </div>
    <div class="bot-main-align mt-[30px] bg-[#ffffff] max-h-[80vh] overflow-y-scroll sm:px-2 md:px-4 lg:px-4 pb-4 field_shadow">
      <div class="flex items-center gap-2 py-4">
        <UiInput v-model="searchBot" class="max-w-[200px]" placeholder="Search bot..." />
        <UiSelect v-model="activeStatus">
          <UiSelectTrigger class="max-w-[200px]">
            <UiSelectValue placeholder="Filter status" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectItem value="true">Active</UiSelectItem>
            <UiSelectItem value="false">In active</UiSelectItem>
          </UiSelectContent>
        </UiSelect>

      </div>

      <DataTable @row-click="(row: any) => {
          console.log({ row });
          return navigateTo(`/bots/${row.original.id}`);
        }
        " :columns="columns" :data="bots" :page-size="8" :is-loading="isDataLoading" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { createColumnHelper } from "@tanstack/vue-table";
definePageMeta({
  middleware: "admin-only",
});


const formSchema = toTypedSchema(
  z.object({
    newBotName: z.string().min(2,"Bot Name is requird."),
  }),
);
const searchBot = ref("");
const searchBotDebounce = refDebounced(searchBot, 500);

const activeStatus = ref("");
watch(activeStatus, async (newStatus, previousStatus) => {
  console.log({ newStatus });
});
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

const { status, data: bots } = await useLazyFetch("/api/bots", {
  server: false,
  default: () => [],
  query: {
    active: activeStatus,
    q: searchBotDebounce,
  },
  transform: (bots) =>
    bots.map((bot) => ({
      id: bot.id,
      name: bot.name,
      status: bot.documentId ? true : false,
      createdAt: formatDateStringToDate(bot.createdAt),
    })),
});
const isDataLoading = computed(() => status.value === "pending");

const addBot = async (value: any) => {
  const bot = await $fetch("/api/bots", {
    method: "POST",
    body: { name: value.newBotName },
    // query: {
    //   organization_id: "4e606bb3-3264-410f-9a2d-4910f17685e3",
    // },
  });
  return navigateTo({
    name: "bots-id",
    params: { id: bot.id },
  });
};

const botManagementDetails = async (list: any) => {
  return navigateTo({
    name: "bots-id",
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
</script>

<style scoped>
/* .bot-manage-main-container {
  padding: 0 25px;
  height: 100%;
  overflow: hidden;
} */

/* .right-dropdown-align {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 0px 10px;
  width: 200px !important;
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
  border-radius: 10px;
} */

.header-align {
  font-family: segoe UI Regular;
}

.bot-main-align {
  height: calc(100vh - 0px);
  /* overflow-y: scroll; */
}

.focus\:ring-offset-2:focus {
  --tw-ring-offset-width: none;
}
</style>
