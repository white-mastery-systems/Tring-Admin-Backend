<template>
  <Page title="Contacts" :disable-back-button="true">
    <!-- {{ getSingleDetails }} -->
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
      :columns="columns" :page-size="20" :height="16" height-unit="vh" />
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
import { Icon, UiBadge, UiButton } from "#components";

definePageMeta({
  middleware: "user",
});
useHead({
  title: "Contacts"
});

const addBucketModalState: any = ref({ open: false, id: null });
const deleteIntegrateNumber = ref({ open: false, id: null });
const exportDataHandler = ref({ status: false, type: "csv" });
const activeStatus = ref("");
const exportReadyRows = ref<any>([]);
const selectedFile = ref();
const isLoading = ref(false)
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
const {
  status,
  data: contactsList,
  refresh: integrationRefresh,
} = await useLazyFetch(`/api/org/contacts`, {
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
// const newBotName = ref("");
// const botList = await listApiBots();

// const { status, data: voiceBot } = await useLazyFetch("/api/voicebots", {
//   server: false,
//   default: () => [],
//   query: {
//     active: activeStatus,
//     q: searchBotDebounce,
//   },
//   headers: {
//     "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
//   },
//   transform: (voiceBot) =>
//     voiceBot.map((bot) => ({
//       id: bot.id,
//       name: bot.name,
//       status: bot.active,
//       createdAt: `${bot.createdAt}`,
//     })),
// });
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
            // e.stopPropagation();
            // addBucketNameModalState.value.open = true;
            // addBucketNameModalState.value.id = id
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

// const bucketNumber = as(id: any) => {
//   try {
//     const deleteIntegration = await $fetch<SelectChatBot>(
//       `/api/org/integrations/${integrationId}`,
//       {
//         method: "DELETE",
//       },
//     );

//     onSuccess();
//     toast.success("Integration removed successfully");

//     return deleteIntegration;
//   } catch (err: any) {
//     if (err.status === 500) {
//       toast.error("Cannot delete: Integration has connected bots");
//     }
//     toast.error(err.data.data[0].message);
//   }
// }
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
    });
    console.log(exportContacts, "exportContacts")
    const exportReadObject = (exportContacts ?? []).map((contacts: any) => {
      const mergedObject = {
        firstName: contacts.firstName ?? "---",
        lastName: contacts.lastName ?? "---",
        email: contacts.email ?? "---",
        countryCode: contacts.countryCode ?? "+91",
        number: contacts.phone ?? "---",
      }
      return mergedObject;
    })
    exportDataHandler.value.status = true;
    exportReadyRows.value = exportReadObject
  } catch(error) {
    console.log(error)
  }
}
const fileUpload = async () => {
  isLoading.value = true
  if (selectedFile.value) {
    const file = selectedFile.value[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === "csv") {
      console.log("Uploading CSV file");
      await uploadNumber(file);
      integrationRefresh()
    } else if (fileExtension === "xls" || fileExtension === "xlsx") {
      console.log("Uploading Excel file");
      await uploadNumber(file);
      integrationRefresh()
    } else {
      isLoading.value = false
      console.error("Unsupported file type:", fileExtension);
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


