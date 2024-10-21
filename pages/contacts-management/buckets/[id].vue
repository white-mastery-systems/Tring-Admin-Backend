<template>
  <Page title="Bucket Contacts" :bread-crumbs="[
    {
    label: getBucketDetails[0]?.bucket.name,
       to: `/contacts-management/buckets`,
    },
    {
      label: 'Buckets',
      to: `/contacts-management/buckets`,
    },
  ]" :disable-back-button="false">
    <DataTable :data="contactsList" @pagination="Pagination" @limit="($event) => {
      (filters.page = '1'), (filters.limit = $event);
    }
      " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :is-loading="isDataLoading"
      :columns="columns" :page-size="20" :height="16" height-unit="vh" />

    <ConfirmationModal v-model:open="deleteBucketListNumber.open" title="Confirm Delete"
      description="Are you sure you want to delete ?" @confirm="() => {
        if (deleteBucketListNumber?.id) {
          insideBucketNumber({
            queryId: queryId,
            id: deleteBucketListNumber.id,
            onSuccess: () => {
              integrationRefresh();
            },
          });
          deleteBucketListNumber.open = false;
        }
      }
        " />
  </Page>
</template>
<script setup lang="ts">
import { createColumnHelper } from "@tanstack/vue-table";
import { Icon, UiBadge, UiButton } from "#components";

definePageMeta({
  middleware: "admin-only",
});
useHead({
  title: "Contacts"
});

const route = useRoute("contacts-management-buckets-id");

const deleteBucketListNumber = ref({ open: false, id: null });
const filters = reactive<{
  q: string;
  page: string;
  limit: string;
}>({
  q: "",
  page: "1",
  limit: "10",
});
let page = ref(0);
let totalPageCount = ref(0);
let totalCount = ref(0);
const queryId = ref(route.params.id)
const getBucketDetails = await getBucketContactsDetails(route.params.id)

const {
  status,
  data: contactsList,
  refresh: integrationRefresh,
} = await useLazyFetch(`/api/org/contact-list/${route.params.id}`, {
  server: false,
  query: filters,
  default: () => [],
  transform: (contacts: any) => {
    page.value = contacts.page;
    totalPageCount.value = contacts.totalPageCount;
    totalCount.value = contacts.totalCount;
    return contacts.map((items: any) => items.contacts);
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
          class: "",
          variant: "destructive",
          onClick: (e: any) => {
            deleteBucketListNumber.value.open = true;
            deleteBucketListNumber.value.id = id;
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
    cell: ({ row }) => {
      console.log(row, "row")
      return row.original.lastName || "-"
    }
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: ({ row }) => {
      return row.original.email || "-";
    }
  }),
  columnHelper.accessor("phone", {
    header: "Number",
    cell: ({ row }) => `${row.original?.countryCode || ''} ${row.original?.phone || ''}`.trim(),
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
