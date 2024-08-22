<template>
  <!-- mt-4 -->
  <div
    class="h-full overflow-hidden py-0 sm:px-[10px] md:px-[25px] lg:px-[25px]"
  >
    <div class="header-align flex items-center justify-between mt-3 sm:mt-3 lg:mt-0 xl:mt-0">
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
            <UiForm
              :validation-schema="formSchema"
              :keep-values="true"
              :validate-on-mount="false"
              class="mb-4 space-y-6"
              @submit="addBot"
            >
              <UiFormField v-slot="{ componentField }" name="newBotName">
                <UiFormItem class="w-full">
                  <UiFormLabel class="font-bold">Bot Name</UiFormLabel>
                  <UiFormControl>
                    <UiInput
                      v-bind="componentField"
                      class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium"
                      placeholder="Enter Bot Name"
                      type="text"
                    />
                    <UiFormDescription lass="text-xs text-gray-500"
                      >Enter your unique identifier for Bot.</UiFormDescription
                    >
                    <UiFormMessage />
                  </UiFormControl>
                </UiFormItem>
              </UiFormField>
              <div class="flex w-full items-center justify-end">
                <UiButton
                  type="submit"
                  class="w-1/2 self-end bg-[#424bd1] text-white hover:bg-[#424bd1] hover:brightness-90"
                >
                  Create
                </UiButton>
              </div>
            </UiForm>
          </UiDialogContent>
        </UiDialog>
        <span
          v-if="false"
          class="field_shadow flex w-[200px] items-center rounded-[10px] bg-[#ffffff] px-[10px] py-0 text-[15px]"
          style="color: rgba(138, 138, 138, 1)"
          >Summary:
          <span class="font-bold text-black">
            <!-- <template> -->
            <UiSelect v-model="selectedValue" class="outline-none">
              <UiSelectTrigger
                class="ui-select-trigger w-[110px] font-medium outline-none"
              >
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
    <div
      class="bot-main-align field_shadow mt-[30px] max-h-[80vh] overflow-y-scroll bg-[#ffffff] pb-4 sm:px-2 md:px-4 lg:px-4"
    >
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
  definePageMeta({
    middleware: "admin-only",
  });

  const formSchema = toTypedSchema(
    z.object({
      newBotName: z.string().min(2, "Bot Name is requird."),
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
    try {
      const bot = await $fetch("/api/bots", {
        method: "POST",
        body: { name: value.newBotName },
      });
      return navigateTo({
        name: "bots-id",
        params: { id: bot.id },
      });
    } catch (err: any) {
      toast.error(err.data.data[0].message);
    }
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

<style scoped></style>
