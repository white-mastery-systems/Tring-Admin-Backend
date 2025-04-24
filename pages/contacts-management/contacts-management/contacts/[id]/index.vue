<template>
  <Page :title="getSingleDetails?.name" :disableSelector="true" :disable-elevation="true" :disable-back-button="false">
    <template #actionButtons>
      <div class="flex gap-4">
        <div class="flex gap-2">
          <UiButton color="primary" @click="() => {
              addBucketModalState.open = true;
              addBucketModalState.id = null;
            }
            ">
            Add Contact
          </UiButton>
        </div>
      </div>
    </template>
    <DataTable :data="contactsList" @pagination="Pagination" @limit="($event) => {
        (filters.page = '1'), (filters.limit = $event);
      }
      " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :is-loading="isDataLoading"
      :columns="columns" :page-size="20" :height="10" height-unit="vh" />
    <CreateEditBucketNumberModal v-model="addBucketModalState" @confirm="() => {
        addBucketModalState.open = false;
        integrationRefresh();
      }
      " />

    <ConfirmationModal v-model:open="deleteIntegrateNumber.open" title="Confirm Delete"
      description="Are you sure you want to delete ?" @confirm="() => {
          if (deleteIntegrateNumber?.id) {
            bucketNumber({
              queryId: queryId,
              id: deleteIntegrateNumber.id,
              onSuccess: () => {
                integrationRefresh();
              },
            });
            deleteIntegrateNumber.open = false;
          }
        }
        " />
  </Page>
</template>
<script setup lang="ts">
import { createColumnHelper } from "@tanstack/vue-table";
import { useRoute } from "vue-router";
import { Icon, UiButton } from "#components";

definePageMeta({
  middleware: "admin-only",
});

const addBucketModalState: any = ref({ open: false, id: null });
const deleteIntegrateNumber = ref({ open: false, id: null });

const route = useRoute();
const queryId = ref(route.params.id);
const { data: getSingleDetails } = await useLazyFetch(
  `/api/org/contact-list/${route.params.id}`,
);
const filters = reactive<{
  q: string;
  page: string;
  limit: string;
}>({
  q: "",
  page: "1",
  limit: "10",
});
const page = ref(0);
const totalPageCount = ref(0);
const totalCount = ref(0);
const {
  status,
  data: contactsList,
  refresh: integrationRefresh,
} = await useLazyFetch(`/api/org/contact-list/${queryId.value}/contacts`, {
  server: false,
  query: filters,
  default: () => [],
  transform: (contacts: any) => {
    page.value = contacts.page;
    totalPageCount.value = contacts.totalPageCount;
    totalCount.value = contacts.totalCount;
    return contacts.data;
  },
});
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
            addBucketModalState.value.open = true;
            addBucketModalState.value.id = id;
          },
          color: "primary",
        },
        h(Icon, { name: "lucide:pen" }),
      ),
      h(
        UiButton,
        {
          class: "",
          variant: "destructive",
          onClick: (e: any) => {
            deleteIntegrateNumber.value.open = true;
            deleteIntegrateNumber.value.id = id;
          }, // Add delete functionality
        },
        h(Icon, { name: "lucide:trash-2" }),
      ),
    ],
  );
const columns = [
  columnHelper.accessor("firstName", {
    header: "First Name",
  }),
  columnHelper.accessor("lastName", {
    header: "Last Name",
  }),
  columnHelper.accessor("phone", {
    header: "Number",
  }),
  columnHelper.accessor("id", {
    header: "Action",
    cell: ({ row }) => {
      return actionsComponent(row.original.id);
    },
  }),
];
</script>