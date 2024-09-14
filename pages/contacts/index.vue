<template>
  <Page title="Buckets" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4">
        <div class="flex gap-2">
          <UiButton
            color="primary"
            @click="
              () => {
                addBucketNameModalState.open = true;
                addBucketNameModalState.id = null;
              }
            "
          >
            Add Bucket
          </UiButton>

          <!-- <UiButton color="primary">
            Import
          </UiButton>
          <UiButton color="primary">
            Export
          </UiButton> -->
        </div>
      </div>
    </template>
    <div>
      <div class="flex items-center gap-2 pb-2">
        <UiInput
          v-model="filters.q"
          @input="filters.page = '1'"
          class="max-w-[200px] focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Search bucket..."
        />
      </div>
      <DataTable
        @row-click="
          (row: any) => {
            return navigateTo(`/contacts/${row.original.id}`);
          }
        "
        @pagination="Pagination"
        :totalPageCount="totalPageCount"
        :page="page"
        :totalCount="totalCount"
        :data="contactsList"
        :is-loading="isDataLoading"
        :columns="columns"
        :page-size="20"
        :height="13"
        height-unit="vh"
      />

      <ConfirmationModal
        v-model:open="deleteBucketState.open"
        title="Confirm Delete"
        description="Are you sure you want to delete ?"
        @confirm="
          () => {
            if (deleteBucketState?.id) {
              deleteBucket({
                integrationId: deleteBucketState.id,
                onSuccess: () => {
                  integrationRefresh();
                },
              });
              deleteBucketState.open = false;
            }
          }
        "
      />
    </div>
    <AddBucketNameModal
      v-model="addBucketNameModalState"
      @confirm="
        () => {
          addBucketNameModalState.open = false;
          integrationRefresh();
        }
      "
    />
  </Page>
</template>
<script setup lang="ts">
  import { createColumnHelper } from "@tanstack/vue-table";
  import { format } from "date-fns";
  import { any } from "zod";
  import { useRoute, useRouter } from "vue-router";
  import AddBucketNameModal from "~/components/voiceBot/DialogModal/AddBucketNameModal.vue";
  import { Icon, UiBadge, UiButton } from "#components";

  definePageMeta({
    middleware: "admin-only",
  });

  const formSchema = toTypedSchema(
    z.object({
      newBotName: z.string().min(2, "Bot Name is requird."),
    }),
  );
  const searchBucket = ref("");
  const searchBotDebounce = refDebounced(searchBucket, 500);
  const deleteBucketState = ref({ open: false, id: null });

  const filters = reactive<{
    q: string;
    page: string;
    limit: string;
  }>({
    q: "",
    page: "1",
    limit: "8",
  });
  // const campaignModalState = ref({ open: false });
  const addBucketNameModalState = ref({ open: false, id: null });

  let page = ref(0);
  let totalPageCount = ref(0);
  let totalCount = ref(0);
  const {
    status,
    data: contactsList,
    refresh: integrationRefresh,
  } = await useLazyFetch("/api/org/contact-list", {
    server: false,
    default: () => [],
    query: filters,
    transform: (buckets: any) => {
      page.value = buckets.page;
      totalPageCount.value = buckets.totalPageCount;
      totalCount.value = buckets.totalCount;
      return buckets.data
    },
  });
  // const addBucketNameModalState = defineModel<{ open: boolean, id: string }>({
  //   default: {
  //     open: false,
  //     id: "",
  //   },
  // });
  const viewCampaignStatusModalState = ref({ open: false });

  const router = useRouter();
  const route = useRoute();
  const activeStatus = ref("");
  watch(activeStatus, async (newStatus, previousStatus) => {});
  const selectedValue = ref("Today");
  // const newBotName = ref("");

  const isDataLoading = computed(() => status.value === "pending");

  const columnHelper = createColumnHelper<(typeof contactsList.value)[0]>();

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
            onClick: (e: Event) => {
              e.stopPropagation();
              addBucketNameModalState.value.open = true;
              addBucketNameModalState.value.id = id;
            },
            color: "primary",
          },
          h(Icon, { name: "lucide:pen" }),
        ),
        h(
          UiButton,
          {
            onClick: (e: any) => {
              e.stopPropagation();
              deleteBucketState.value.id = id;
              deleteBucketState.value.open = true;
            }, // Add delete functionality
            class: "bg-[#f44336] hover:bg-[#f44336] font-bold", // Different color for delete
          },
          h(Icon, { name: "lucide:trash-2" }),
        ),
        // h(
        //   UiButton,
        //   {
        //     onClick: () => {
        //       addBucketModalState.value.open = true
        //       addBucketModalState.value.id = id
        //       console.log("addBucketModalState")
        //     }, // Add delete functionality
        //     class: "bg-[#424bd1] hover:bg-[#424bd1] font-bold", // Different color for delete
        //   },
        //   [h({ name: "ph:trash-light", class: "h-4 w-4 mr-2" }), "Add"]
        // )
      ],
    );

  const columns = [
    columnHelper.accessor("name", {
      header: "Bucket Name",
    }),
    columnHelper.accessor("noOfAudience", {
      header: "No. of Audiences",
    }),
    columnHelper.accessor("id", {
      header: "Action",
      cell: ({ row }) => {
        return actionsComponent(row.original.id);
      },
    }),
  ];

  
   const Pagination = async ($evnt) => {
    filters.page = $evnt;
    integrationRefresh();
  };
</script>

<style scoped></style>
