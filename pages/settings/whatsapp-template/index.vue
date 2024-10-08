<template>
  <Page title="Whatsapp Templates" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4">
        <div class="flex gap-2">
          <UiButton
            color="primary"
            @click="
              () => {
                addWhatappTemplateModalState.open = true;
                addWhatappTemplateModalState.id = null;

                templateStore.resetValues();
              }
            "
          >
            Add Template
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
          placeholder="Search Template..."
        />
      </div>
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
        :data="contactsList"
        :is-loading="isDataLoading"
        :columns="columns"
        :page-size="20"
        :height="16"
        height-unit="vh"
      />

      <ConfirmationModal
        v-model:open="deleteTemplateState.open"
        title="Confirm Delete"
        description="Are you sure you want to delete ?"
        @confirm="
          () => {
            if (deleteTemplateState?.id) {
              deleteSingleTemplate({
                id: deleteTemplateState.id,
                onSuccess: () => {
                  integrationRefresh();
                },
              });
              deleteTemplateState.open = false;
            }
          }
        "
      />
    </div>
    <AddEditWhatsappTemplateModal
      v-if="addWhatappTemplateModalState.open"
      v-model="addWhatappTemplateModalState"
      @confirm="
        () => {
          addWhatappTemplateModalState.open = false;
          integrationRefresh();
        }
      "
    />
  </Page>
</template>
<script setup lang="ts">
  import { Icon, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";
  import { useRoute, useRouter } from "vue-router";
  import { useTemplateStore } from "~/store/whatsAppTemplateStore";
  const templateStore = useTemplateStore();

  definePageMeta({
    middleware: "admin-only",
  });
  useHead({
    title: "Contacts Management | Contacts",
  });

  const formSchema = toTypedSchema(
    z.object({
      newBotName: z.string().min(2, "Bot Name is requird."),
    }),
  );
  const searchBucket = ref("");
  const searchBotDebounce = refDebounced(searchBucket, 500);
  const deleteTemplateState = ref({ open: false, id: null });

  const filters = reactive<{
    q: string;
    page: string;
    limit: string;
  }>({
    q: "",
    page: "1",
    limit: "10",
  });
  // const campaignModalState = ref({ open: false });
  const addWhatappTemplateModalState = ref({ open: false, id: null });

  watch(
    () => addWhatappTemplateModalState,
    (newValue) => {},
  );

  let page = ref(0);
  let totalPageCount = ref(0);
  let totalCount = ref(0);
  const {
    status,
    data: contactsList,
    refresh: integrationRefresh,
  } = await useLazyFetch("/api/templates", {
    server: false,
    default: () => [],
    query: filters,
    transform: (buckets: any) => {
      page.value = buckets.page;
      totalPageCount.value = buckets.totalPageCount;
      totalCount.value = buckets.totalCount;
      return buckets.data;
    },
  });
  // const addWhatappTemplateModalState = defineModel<{ open: boolean, id: string }>({
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
              addWhatappTemplateModalState.value.open = true;
              addWhatappTemplateModalState.value.id = id;
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
              deleteTemplateState.value.id = id;
              deleteTemplateState.value.open = true;
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
      header: "Template Name",
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
