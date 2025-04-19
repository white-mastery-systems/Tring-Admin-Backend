<template>
  <div>
    <DataTable
      @pagination="Pagination"
      @limit="
        ($event) => {
          (filters.page = '1'), (filters.limit = $event);
        }
      "
      :totalPageCount="totalPageCount"
      :page="page"
      :totalCount="totalCount"
      :columns="columns"
      :data="campaignDataList"
      :is-loading="isDataLoading"
      :page-size="20"
      :height="21"
      height-unit="vh"
    />
    <CreateEditCampaignModal
      v-model="campaignModalState"
      @confirm="
        () => {
          campaignModalState.open = false;
          refresh();
        }
      "
    />
  </div>
  <!-- </Page> -->
</template>
<script setup lang="ts">
  import { useState } from "#app";
  import { Icon, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";
  import { useRoute } from "vue-router";
  import { useSingleCampaign } from "~/composables/useSingleCampaign";

  const filters = useState("campaignsFilters", () => ({
    q: "",
    page: "1",
    limit: "10",
    period: "",
    from: undefined,
    to: undefined,
  }));
  const route = useRoute();
  const campaignModalState = ref({ open: false, id: null });
  const {
    status,
    campaignDataList,
    refresh,
    page,
    totalPageCount,
    totalCount,
    failedCampaigns,
  } = useSingleCampaign(route.params.id, filters);

  const isDataLoading = computed(() => status.value === "pending");
  const Pagination = async ($evnt: any) => {
    filters.value.page = $evnt;
  };

  const viewLead = async (callSid: any) => {
    await navigateTo({
      name: "analytics-chats-id",
      params: { id: callSid },
    });
  };
  const columnHelper = createColumnHelper<(typeof campaignDataList.value)[0]>();

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
            onClick: () => {
              if (id) viewLead(id); // Only execute if `id` exists
            },
            class: "bg-[#ffbc42] hover:bg-[#ffbc42] font-bold",
            disabled: !id, // Disable if `id` is null/undefined
          },
          [h(Icon, { name: "ph:eye-light", class: "h-4 w-4 mr-2" }), "View"],
        ),
      ],
    );

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
    }),
    columnHelper.accessor("formattedMessageStatus", {
      header: "Message Status",
      cell: ({ row }) =>
        h(
          "div",
          {
            style: "white-space: pre-line;", // This allows \n to render as new lines
          },
          row.original.formattedMessageStatus,
        ),
    }),
    columnHelper.accessor("messageStatus", {
      header: "Delivery status",
      cell: ({ row }) => {
        return capitalizeFirstLetter(row.original.messageStatus);
      },
    }),
    columnHelper.accessor("chatId", {
      header: "Action",
      cell: ({ row }) => {
        return actionsComponent(row.original?.chatId);
      },
    }),
  ];
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
</script>
