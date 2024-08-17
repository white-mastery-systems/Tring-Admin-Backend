<template>
  <!-- mt-4 -->
  <div class="bot-manage-main-container">
    <div class="header-align">
      <span class="text-[20px] font-bold">Bot Management</span>
      <div class="flex gap-4">
        <UiDialog>
          <UiDialogTrigger as-child>
            <UiButton
              class="button-align bg-[#424bd1] text-[14px] font-medium hover:bg-[#424bd1] hover:brightness-95"
            >
              Add Bot
            </UiButton>
          </UiDialogTrigger>
          <UiDialogContent>
            <UiDialogHeader>
              <UiDialogTitle>Add a New Bot</UiDialogTitle>
            </UiDialogHeader>
            <div class="individual-form-align">
              <label for="frole" class="pb-2 pl-0 font-medium">Bot Name</label>
              <input
                type="text"
                id="frole"
                v-model="newBotName"
                name="fname"
                placeholder="Enter Bot Name"
              />
              <UiButton
                @click="addBot"
                class="mt-4 w-1/2 self-end bg-[#424bd1] text-white hover:bg-[#424bd1] hover:brightness-90"
                >Create
              </UiButton>
            </div>
          </UiDialogContent>
        </UiDialog>
        <span
          v-if="false"
          class="right-dropdown-align text-[15px]"
          style="color: rgba(138, 138, 138, 1)"
          >Summary:
          <span class="font-bold text-black">
            <!-- <template> -->
            <UiSelect v-model="selectedValue" class="outline-none">
              <UiSelectTrigger class="ui-select-trigger w-[110px] outline-none">
                <UiSelectValue />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup class="select_list_align">
                  <!-- <UiSelectLabel>Today</UiSelectLabel> -->
                  <UiSelectItem
                    v-for="(list, index) in menuList"
                    :key="index"
                    class="content_align"
                    :value="list.content"
                  >
                    {{ list.content }}
                  </UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
            <!-- </template> -->
          </span></span
        >
      </div>
    </div>
    <div class="bot-main-align max-h-[80vh] overflow-y-scroll px-4 pb-4">
      <div class="flex items-center gap-2 py-4">
        <UiInput
          v-model="searchBot"
          class="max-w-[200px]"
          placeholder="Search bot..."
        />
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

      <DataTable
        @row-click="
          (row: any) => {
            console.log({ row });
            return navigateTo(`/bots/${row.original.id}`);
          }
        "
        :columns="columns"
        :data="bots"
        :page-size="8"
        :is-loading="isDataLoading"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { createColumnHelper } from "@tanstack/vue-table";
  // import {
  //   DropdownMenu,
  //   DropdownMenuCheckboxItem,
  //   DropdownMenuContent,
  //   DropdownMenuTrigger,
  // } from '@/components/ui/dropdown-menu'

  definePageMeta({
    middleware: "admin-only",
  });
  const searchBot = ref("");
  const searchBotDebounce = refDebounced(searchBot, 500);

  const activeStatus = ref("");
  watch(activeStatus, async (newStatus, previousStatus) => {
    console.log({ newStatus });
  });
  const selectedValue = ref("Today");
  const newBotName = ref("");

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

  const addBot = async () => {
    const bot = await $fetch("/api/bots", {
      method: "POST",
      body: { name: newBotName.value },
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
  .individual-form-align {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    height: 150px;
  }

  .individual-form-align input {
    background-color: rgba(246, 246, 246, 1);
    width: 100%;
    height: 50px;
    outline: none;
    border-radius: 10px;
    padding: 0 20px;
    /* margin-top: 20px; */
  }

  .bot-manage-main-container {
    padding: 0 25px;
    height: 100%;
    overflow: hidden;
  }

  .right-dropdown-align {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 1);
    padding: 0px 10px;
    width: 200px !important;
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
  }

  .header-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: segoe UI Regular;
  }

  .bot-main-align {
    margin-top: 30px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05);
    height: calc(100vh - 0px);
    /* overflow-y: scroll; */
  }

  .ui-select-trigger {
    font-weight: 500;
    /* color: rgba(138, 138, 138, 1); */
  }

  .focus\:ring-offset-2:focus {
    --tw-ring-offset-width: none;
  }

  .content-align {
    font-size: 16px;
    /* width: 100px !important; */
    margin-bottom: 5px;
    /* color: rgba(138, 138, 138, 1); */
  }

  .list-header-align {
    padding: 10px 48px;
    display: flex;
    /* justify-content: space-between; */
    width: 100%;
    /* gap: 100px; */
    border-bottom: 0.5px solid rgba(181, 181, 181, 1);
  }

  .list_align {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    overflow-y: scroll;
    /* height: calc(100% - 200px); */
    cursor: pointer;
    padding: 0 15px 15px 15px;

    /* width: 100%; */
    /* background: rgba(255, 255, 255, 1); */
    /* padding: 30px 30px; */
    /* box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important; */
    border-radius: 10px;
    /* gap: 100px; */
    /* margin: 10px 0; */
  }

  .overflow_align {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 90%;
    overflow-y: scroll;
    width: 100%;
    padding: 5px 5px 20px 5px;
  }

  .bot-list-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 1);
    padding: 20px 0px;
    width: 100% !important;
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
    margin: 20px 0 0 0;
    font-size: 15px;
  }

  .acive_class {
    display: flex;
    align-items: center;
    color: rgba(26, 187, 0, 1);
    gap: 5px;
    padding-inline-end: 213px;
  }

  .deacive_class {
    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(255, 0, 0, 1);
    padding-inline-end: 201px;
  }

  .active-circle-align {
    display: flex;
    align-items: center;
    background-color: rgba(26, 187, 0, 1);
    width: 5px;
    height: 5px;
  }

  .deactive-circle-align {
    display: flex;
    align-items: center;
    background-color: rgba(255, 0, 0, 1);
    width: 5px;
    height: 5px;
  }

  .header-content-align {
    display: flex;
    justify-content: space-between;
    width: 65%;
  }

  .bot_name_align {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    padding-inline-start: 30px;
  }

  .bot-list-align:hover {
    color: rgba(255, 188, 66, 1);
    background: rgba(255, 248, 235, 1) !important;
  }

  .arrow-aling {
    width: 30px;
  }

  /* .createAt_align {
  padding-inline-end: 114px;
} */
</style>
