<template>
  <div class="mb-[50px] sm:mb-[50px] md:mb-7">
    <div class="document-align flex flex-col mt-0 mb-6">
      <div class="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-bold mb-6"> Document Management </div>
      <span class="flex flex-row">
        <DocumentUploadV2 accept="application/pdf" v-model="selectedFile" @upload-document="fileUpload()" />
      </span>
    </div>
    <DataTable @pagination="Pagination" @limit="(v$event) => {
        (filters.page = '1'), (filters.limit = $event);
      }" :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns"
      :data="documentItems" :is-loading="isDataLoading" :page-size="20" :height="23" height-unit="vh" />
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
const route = useRoute();
const paramId: any = route;
const selectedFile = ref();
const myPopover: any = ref(null);
// const botDetails: any = await getBotDetails(paramId.params.id);
// const documents = ref();
const documentFetchInterval = ref<NodeJS.Timeout>();

const deleteDocumentModelOpen: any = reactive({});
const isSheetOpen = ref(false);
const position = ref("bottom");
const page = ref(0);
const totalPageCount = ref(0);
const totalCount = ref(0);

const props = defineProps<{
  documents: any;
  refreshBot: () => void;
  refresh: () => void
}>();
const documentItems = computed(() => props.documents?.documents || []);
const activeDocument = computed(() => props.documents?.documentId)

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
      const BotDocumentMenu = defineAsyncComponent(() => import('@/components/bots/BotDocumentMenu.vue'));

      return h(BotDocumentMenu, {
        row: row.original, // Pass the row data to the component
        documents: documentItems.value,
        // Handle the download and delete actions
        onDownload: (id: any) => {
          // Call your existing method for handling download
          singleDocumentDownload(id);
        },
        onDelete: (list: any) => {
          // Call your existing method for handling delete
          singleDocumentDelete(list);
        },
      });
    },
  }),
];

onMounted(async () => {
  const eventSource = new EventSource("/api/sse");
  eventSource.onmessage = async (event) => {
    const data = JSON.parse(event.data);

    if (data.event === "Document is ready") {
      if (data?.data?.botId === paramId.params.id) {
        await props.refresh();
      }
    }

    // Update your component state with the received data
  };
});
const isPageLoading = computed(() => status.value === "pending");

const fileUpload = async () => {
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
    
    await props.refresh()
    selectedFile.value = null;
  } else {
    selectedFile.value = null;
  }
  await props.refresh()
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
  await props.refresh()
  // documents.value = await listDocumentsByBotId(paramId.params.id);
};
const singleDocumentDownload = async (list: any) => {
  viewDocument(paramId.params.id, list.id);
};
const Pagination = async ($event: any) => {
  filters.page = $event
  await props.refresh()
}
</script>