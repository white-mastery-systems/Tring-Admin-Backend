<template>
  <Page title="Chat Bot" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4">
        <UiDialog>
          <UiDialogTrigger as-child>
            <UiButton
              class="button-align bg-[#424bd1] text-[14px] font-medium hover:bg-[#424bd1] hover:brightness-95"
            >
              Add Chat Bot
            </UiButton>
          </UiDialogTrigger>
          <UiDialogContent class="w-[90%] rounded-xl">
            <UiDialogHeader>
              <UiDialogTitle>Add a New Chat Bot</UiDialogTitle>
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
                  <UiFormLabel class="font-bold">Chat Bot Name</UiFormLabel>
                  <UiFormControl>
                    <UiInput
                      v-bind="componentField"
                      class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium"
                      placeholder="Enter Chat Bot Name"
                      type="text"
                    />
                    <UiFormDescription lass="text-xs text-gray-500"
                      >Enter your unique identifier for Chat Bot.
                    </UiFormDescription>
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
    </template>
    <div class="flex items-center gap-2 pb-2">
      <UiInput
        v-model="searchBot"
        class="max-w-[200px] focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Search bot..."
      />
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

    <DataTable
      @row-click="
        (row: any) => {
          return navigateTo(`/bot-management/chat-bot/${row.original.id}`);
        }
      "
      :columns="columns"
      :data="bots"
      :page-size="20"
      :is-loading="isDataLoading"
      :height="60"
      height-unit="vh"
    />
  </Page>
</template>
<script setup lang="ts">
  import { createColumnHelper } from "@tanstack/vue-table";
  import { format } from "date-fns";

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
  watch(activeStatus, async (newStatus, previousStatus) => {});
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
    headers: {
      "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    transform: (bots) =>
      bots.map((bot) => ({
        id: bot.id,
        name: bot.name,
        status: bot.documentId ? true : false,
        createdAt: `${format(bot.createdAt, "dd MMM yyyy HH:MM ")}`,
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
        name: "bot-management-chat-bot-id",
        params: { id: bot.id },
      });
    } catch (err: any) {
      toast.error(err.data.data[0].message);
    }
  };

  const botManagementDetails = async (list: any) => {
    return navigateTo({
      name: "bot-management-chat-bot-id",
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
