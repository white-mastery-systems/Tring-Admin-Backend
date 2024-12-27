<template>
  <!-- <Page title="Contacts" :disable-back-button="true"> -->
  <div>
    <div class="flex items-center justify-between gap-2 overflow-x-scroll pb-4">
      <div>
        <UiInput v-model="filters.q" @input="filters.page = '1'"
          class="min-w-[130px] max-w-[130px] focus-visible:ring-0 focus-visible:ring-offset-0 sm:max-w-[130px] md:max-w-[200px] lg:max-w-[200px] xl:max-w-[200px]"
          placeholder=" Search Contacts..." />
      </div>
      <div class="flex items-center gap-2">
        <SampleImport :columns="exportReadyColumns" />
        <ImportNumberFile accept=".csv, .xls, .xlsx" v-model="selectedFile" @uploadDocument="fileUpload"
          :isLoading="isLoading" />
        <ExportButton v-model="exportDataHandler" :rows="exportReadyRows" :columns="exportReadyColumns"
          @export="exportData" buttonContent="Export Contacts" />
      </div>
    </div>
    <DataTable :data="contactsList" @pagination="Pagination" @limit="($event) => {
      (filters.page = '1'), (filters.limit = $event);
    }
      " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :is-loading="isDataLoading"
      :columns="columns" :page-size="20" :height="17" height-unit="vh" />

    <CreateEditBucketNumberModal :typeOfAddContacts='addChatBotContacts' v-model="addBucketModalState" botType="chat"
      @confirm="() => {
      addBucketModalState.open = false;
      integrationRefresh();
    }
      " />

    <ConfirmationModal v-model:open="deleteIntegrateNumber.open" title="Confirm Delete"
      description="Are you sure you want to delete ?" @confirm="() => {
        if (deleteIntegrateNumber?.id) {
           if (props.typeOfAddContacts === 'insideBucket') {
            console.log('asfsaf sfsadfsafda', deleteIntegrateNumber)
            insideBucketNumber({
              queryId: queryId,
              id: deleteIntegrateNumber.id,
              onSuccess: () => {
                integrationRefresh();
              },
            });
          } else {
            bucketNumber({
              queryId: queryId,
              id: deleteIntegrateNumber.id,
              botType: 'chat',
              onSuccess: () => {
                integrationRefresh();
              },
            });
          }
          deleteIntegrateNumber.open = false;
        }
      }
        " />
  </div>
  <!-- </Page> -->
</template>
<script setup lang="ts">
import { createColumnHelper } from "@tanstack/vue-table";
import { Icon, UiBadge, UiButton } from "#components";

definePageMeta({
  middleware: "user",
});
useHead({
  title: "Contacts"
});

const props = defineProps<{ popupState?: boolean, typeOfAddContacts: string }>();
const emit = defineEmits<{ (e: "popupState", payload: any): void }>();
const addBucketModalState: any = ref({ open: false, id: null });
const deleteIntegrateNumber = ref({ open: false, id: null });
const exportDataHandler = ref({ status: false, type: "csv" });
const activeStatus = ref("");
const exportReadyRows = ref<any>([]);
const selectedFile = ref();
const isLoading = ref(false)
const filters = reactive<{
  type: string;
  q: string;
  page: string;
  limit: string;
}>({
  type: "chat",
  q: "",
  page: "1",
  limit: "10",
});
let page = ref(0);
let totalPageCount = ref(0);
let totalCount = ref(0);
const route = useRoute("contacts-management-buckets-id");
// const searchContacts = ref("");
const queryId = ref(route.params.id)
const addChatBotContacts = ref()


const apiUrl = computed(() => {
  return props.typeOfAddContacts === "insideBucket"
    ? `/api/org/contact-list/${route.params.id}`
    : `/api/org/contacts`;
});

const {
  status,
  data: contactsList,
  refresh: integrationRefresh,
} = await useLazyFetch(apiUrl, {
  server: false,
  query: filters,
  default: () => [],
  transform: (contacts: any) => {
    page.value = contacts.page;
    totalPageCount.value = contacts.totalPageCount;
    totalCount.value = contacts.totalCount;
    return props.typeOfAddContacts === "insideBucket"
      ? contacts.data.contacts.map((contact: any) => contact.contacts)
      : contacts.data;
    // return contacts.data;
  },
});

watch(() => route.params.id, (newQueryId) => {
  if (newQueryId) {
    integrationRefresh()
  }
})

watchEffect(() => {
  addChatBotContacts.value = props.typeOfAddContacts
})
const exportReadyColumns = computed(() => {
  return [
    "First Name",
    "Last Name",
    "Email",
    "Country Code",
    "Number",
  ]
})
const isDataLoading = computed(() => status.value === "pending");
const columnHelper = createColumnHelper<(typeof contactsList.value)[0]>();

watch(
    () => props.popupState,
    (newValue: any) => {
      addBucketModalState.value.open = newValue;
      addBucketModalState.value.id = null
    },
  );
watch(
  () => addBucketModalState.value.open,
  (newValue) => {
    if (!newValue) {
      emit("popupState", addBucketModalState.value.open);
    }
  },
);
const actionsComponent = (id: any) =>
  h(
    "div",
    {
      class: "flex items-center gap-2",
    },
    [
      props.typeOfAddContacts !== "insideBucket" &&
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
    cell: ({ row }) => {
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
const exportData = async () => {
  try {
    const exportContacts = await $fetch(`/api/org/contacts`, {
      method: "GET",
      headers: {
        "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      params: {
        type: "chat"
      }
    });
    const exportReadObject = (exportContacts ?? []).map((contacts: any) => {
      const mergedObject = {
        firstName: contacts.firstName ?? "",
        lastName: contacts.lastName ?? "",
        email: contacts.email ?? "",
        countryCode: contacts.countryCode ?? "+91",
        number: contacts.phone ?? "",
      }
      return mergedObject;
    })
    exportDataHandler.value.status = true;
    exportReadyRows.value = exportReadObject
  } catch (error) {
    console.log(error)
  }
}
const fileUpload = async () => {
  isLoading.value = true
  if (selectedFile.value) {
    const file = selectedFile.value[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === "csv") {
      if (props.typeOfAddContacts === "insideBucket") await uploadBucketNumber(file, route.params.id);
      else await uploadNumber(file, 'chat');
      integrationRefresh()
    } else if (fileExtension === "xls" || fileExtension === "xlsx") {
      if (props.typeOfAddContacts === "insideBucket") await uploadBucketNumber(file, route.params.id);
      else await uploadNumber(file, 'chat');
      integrationRefresh()
    } else {
      isLoading.value = false
      toast.error("Only CSV and Excel files are allowed.");
      return;
    }
  } else {
    isLoading.value = false
    console.log("No file selected");
  }
  isLoading.value = false
};
</script>