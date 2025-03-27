<template>
  <div>
    <div class="flex justify-center items-center mb-2 w-full">
      <span class="flex flex-row w-full mb-2">
        <DocumentUploadV2 accept="application/pdf" v-model="selectedFile" @upload-document="fileUpload()" />
        <!-- <DocumentUpload accept="application/pdf" v-model="selectedFile" @upload-document="fileUpload()" /> -->
        <!-- <img src="assets\icons\upload _document.svg" width="100" /> -->
      </span>
    </div>
    <!-- <p class="pt-2 pb-6 text-sm text-gray-400">only PDF</p> -->
    <div class="w-full overflow-x-auto">
      <DataTable @pagination="Pagination" @limit="($event) => {
         (filters.page = '1'), (filters.limit = $event);
       }
       " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns"
        :data="documentItems" :is-loading="isDataLoading" :page-size="20" :height="35" height-unit="vh"
        :paginationControl="false" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { createColumnHelper } from "@tanstack/vue-table";
import { h } from 'vue';

definePageMeta({
  middleware: "admin-only",
});

import { ref } from "vue";
const router = useRouter();
const filters = reactive<{
  q: string;
  page: string;
  limit: string;
  active: string;
}>({
  q: "",
  active: "",
  page: "1",
  limit: "10",
});
const route = useRoute("chat-bot-create-bot-id");
const paramId: any = route;
const selectedFile = ref();
const myPopover: any = ref(null);
const props = defineProps<{
  refresh: () => void
}>();
// const botDetails: any = await getBotDetails(paramId.params.id);
// const documents = ref();
const documentFetchInterval = ref<NodeJS.Timeout>();

const deleteDocumentModelOpen: any = reactive({});
const isSheetOpen = ref(false);
const position = ref("bottom");
let page = ref(0);
let totalPageCount = ref(0);
let totalCount = ref(0);

const {
  status,
  refresh: documentsRefresh,
  data: documents,
} = await useLazyFetch(() => `/api/bots/${paramId.params.id}/documents`, {
  server: false,
  /**
   * Transform the API response to format the createdAt date of each document
   * @param {object} docs - The API response
   * @returns {object} The transformed response
   */
  transform: (docs: any) => {
    page.value = docs.page;
    totalPageCount.value = docs.totalPageCount;
    totalCount.value = docs.totalCount;

    return {
      ...docs,
      documents: docs.documents.map((d: any) => ({
        ...d,
        createdAt: formatDate(new Date(d.createdAt), "dd.MM.yyyy"),
      }))
    };
  },
});

const documentItems = computed(() => documents.value?.documents || []);
const activeDocument = computed(() => documents.value?.documentId)

const isDataLoading = computed(() => status.value === "pending");
const columnHelper = createColumnHelper<(typeof documentItems.value)[0]>();
const statusComponent = (status: any) => {
  const statusText = status === 'ready' ? 'Success'
    : status === 'processing' ? 'Processing'
      : 'Failed';

  const statusClass = status === 'ready' ? 'text-green-500'
    : status === 'processing' ? 'text-yellow-500'
      : 'text-red-500';

  const circleClass = status === 'ready' ? 'bg-green-500'
    : status === 'processing' ? 'bg-yellow-500'
      : 'bg-red-500';

  return h(
    "div",
    { class: `flex items-center font-medium ${statusClass}`, style: { gap: '5px' } },
    [
      h("div", { class: `rounded-full ${circleClass}`, style: { width: '5px', height: '5px' } }),
      h("span", statusText)
    ]
  );
};



const columns = [
  columnHelper.accessor("name", {
    header: "File Name",
    cell: ({ row }) => {
      const isActive = row.original.id === activeDocument.value; // Check condition
      return h("div", [
        h("span", [
          row.original.name, // Display file name
          isActive &&
          h("span", { class: "text-[#22c55e] ml-4 text-[13px]" }, "Active") // Append "Active" with specific styling
        ])
      ]);
    }
  }),
  columnHelper.accessor("createdAt", {
    header: "Uploaded Date",
  }),

  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => statusComponent(row.original.status),
  }),
   columnHelper.accessor("id", {
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;

      return h(
      "button",
      {
        class: "px-3 py-1 bg-[#FFBC42] text-white rounded hover:bg-blue-600",
        onClick: (event) => {
          event.preventDefault();  // Prevent default form submission behavior
          event.stopPropagation(); // Stop event bubbling
          singleDocumentDownload(id);
        },
      },
      "Download"
    );
    },
  }),
    // return h(BotDocumentMenu, {
    //   row: row.original, // Pass the row data to the component
    //   documents: documentItems.value,
    //   // Handle the download and delete actions
    //   onDelete: (list: any) => {
    //     // Call your existing method for handling delete
    //     singleDocumentDelete(list);
    //   },
    
];

watch(() => documents.value, (newDocuments) => {
  if (!newDocuments.documents.length) return;
  props.refresh()
})
onMounted(async () => {
  const eventSource = new EventSource("/api/sse");
  eventSource.onmessage = async (event) => {
    const data = JSON.parse(event.data);

    if (data.event === "Document is ready") {
      if (data?.data?.botId === paramId.params.id) {
        documentsRefresh();
      }
    }

    // Update your component state with the received data
  };
});
const isPageLoading = computed(() => status.value === "pending");

// watchEffect(() => {
//   if (botDetails) {
//     const userName = botDetails?.name ?? "Unknown Bot Name";
//     useHead({
//       title: `Chat Bot | ${userName} - Document Management`,
//     });
//   }
// });

const fileUpload = async () => {
  // selectedFile.value[0].name;
  //
  if (selectedFile.value && selectedFile.value[0]) {
    const file = selectedFile.value[0];
    if (!file.type.includes("pdf")) {
      toast.error("Unsupported file type. Only PDFs are allowed.");
      selectedFile.value = null;
      return;
    }
    const payload: any = {
      botId: paramId.params.id,
      document: {
        name: selectedFile.value[0].name,
        files: selectedFile.value[0],
      },
    };
    await createDocument(payload.botId, payload.document);
    documents.value = await listDocumentsByBotId(paramId.params.id);
    selectedFile.value = null;
  } else {
    selectedFile.value = null;
  }
  // documentFetchInterval.value = setInterval(async () => {
  //   documents.value = await listDocumentsByBotId(paramId.params.id);
  // }, 1000);
};
const handleAction = (list: any, action: any) => {
  if (myPopover.value) {
    myPopover.value = false;
  }
  isSheetOpen.value = false;

  switch (action) {
    case "download":
      singleDocumentDownload(list);
      break;
    case "delete":
      singleDocumentDelete(list);
      break;
  }
};

onUnmounted(() => {
  documentFetchInterval.value && clearInterval(documentFetchInterval.value);
});

const singleDocumentDelete = async (list: any) => {
  await deleteDocument(paramId.params.id, list.id);

  documents.value = await listDocumentsByBotId(paramId.params.id);
};
const singleDocumentDownload = async (list: any) => {
  viewDocument(paramId.params.id, list);
};
// const singleDocumentDownload = (documentId) => {
//   window.open(`/api/bots/${paramId.params.id}/documents/${documentId}`, '_blank');
// };
// const singleDocumentDownload = async (documentId) => {
//   try {
//     // Create the URL to fetch the document
//     const url = `/api/bots/${paramId.params.id}/documents/${documentId}`;
    
//     // Fetch the document as a blob
//     const response = await fetch(url);
//     const blob = await response.blob();
    
//     // Create a download link
//     const downloadUrl = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
    
//     // Get the filename from headers or use a default
//     const contentDisposition = response.headers.get('content-disposition');
//     let filename = 'document.pdf';
    
//     if (contentDisposition) {
//       const filenameMatch = contentDisposition.match(/filename="(.+)"/);
//       if (filenameMatch && filenameMatch[1]) {
//         filename = filenameMatch[1];
//       }
//     }
    
//     // Set up the download link
//     a.href = downloadUrl;
//     a.download = filename;
//     document.body.appendChild(a);
    
//     // Trigger the download
//     a.click();
    
//     // Clean up
//     window.URL.revokeObjectURL(downloadUrl);
//     document.body.removeChild(a);
    
//   } catch (error) {
//     console.error('Error downloading document:', error);
//     toast.error('Failed to download document');
//   }
// };
const Pagination = async ($event: any) => {
  filters.page = $event
  documentsRefresh()
}
</script>

<style scoped>
.document-align {
  margin-top: 40px;
}
</style>
