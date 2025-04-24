<template>
  <div>
    <div class="flex justify-center items-center mb-2 w-full">
      <span class="flex flex-row w-full mb-2">
        <DocumentUploadV2 accept="application/pdf" v-model="selectedFile" @upload-document="fileUpload()" />
      </span>
    </div>
    <div class="flex max-w-[300px] sm:max-w-[300px] md:max-w-full">
      <DataTable @pagination="Pagination" @limit="($event) => {
        (filters.page = '1'), (filters.limit = $event);
      }" :totalPageCount="props.totalPageCount" :page="props.page" :totalCount="props.totalCount" :columns="columns"
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

import { ref, computed, reactive, watch, onMounted, onUnmounted } from "vue";

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
const isSheetOpen = ref(false);
const isLoading = ref(false);

// Define props with proper types
const props = defineProps<{
  documents: any;
  page: number;
  totalCount: number;
  totalPageCount: number;
  isUploading: boolean;
  refresh: () => void
}>();

const documentFetchInterval = ref<NodeJS.Timeout>();

// Computed properties using props
const documentItems = computed(() => props.documents || []);
const activeDocument = computed(() => props.documents?.documentId);
const isDataLoading = computed(() => props.isUploading);

// Column helper
const columnHelper = createColumnHelper<(typeof documentItems.value)[0]>();

// Status component
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

// Column definitions
const columns = [
  columnHelper.accessor("name", {
    header: "File Name",
    cell: ({ row }) => {
      const isActive = row.original.id === activeDocument.value;
      return h("div", [
        h("span", [
          row.original.name,
          isActive &&
          h("span", { class: "text-[#22c55e] ml-4 text-[13px]" }, "Active")
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
          class: "px-3 py-1 bg-[#FFBC42] text-white rounded hover:bg-[#FFBC42]-600",
          onClick: (event) => {
            event.preventDefault();
            event.stopPropagation();
            singleDocumentDownload(id);
          },
        },
        "Download"
      );
    },
  }),
];

// Watch for document changes
watch(() => props.documents, (newDocuments) => {
  if (newDocuments && newDocuments.documents && newDocuments.documents.length > 0) {
    props.refresh();
  }
}, { deep: true });

// Setup SSE listener
onMounted(async () => {
  const eventSource = new EventSource("/api/sse");
  eventSource.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    if (data.event === "Document is ready" && data?.data?.botId === paramId.params.id) {
      props.refresh();
    }
  };
});

// File upload handler
const fileUpload = async () => {
  if (selectedFile.value && selectedFile.value[0]) {
    const file = selectedFile.value[0];
    if (!file.type.includes("pdf")) {
      toast.error("Unsupported file type. Only PDFs are allowed.");
      selectedFile.value = null;
      return;
    }

    isLoading.value = true;
    try {
      const payload: any = {
        botId: paramId.params.id,
        document: {
          name: selectedFile.value[0].name,
          files: selectedFile.value[0],
        },
      };

      await createDocument(payload.botId, payload.document);
      props.refresh(); // Call parent's refresh function
      selectedFile.value = null;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload document");
    } finally {
      isLoading.value = false;
    }
  } else {
    selectedFile.value = null;
  }
};

// Cleanup on component unmount
onUnmounted(() => {
  documentFetchInterval.value && clearInterval(documentFetchInterval.value);
});

// Document delete handler
const singleDocumentDelete = async (list: any) => {
  isLoading.value = true;
  try {
    await deleteDocument(paramId.params.id, list.id);
    props.refresh(); // Call parent's refresh function
  } catch (error) {
    console.error("Error deleting document:", error);
    toast.error("Failed to delete document");
  } finally {
    isLoading.value = false;
  }
};

// Document download handler
const singleDocumentDownload = async (list: any) => {
  try {
    await viewDocument(paramId.params.id, list);
  } catch (error) {
    console.error("Error downloading document:", error);
    toast.error("Failed to download document");
  }
};

// Pagination handler
const Pagination = async ($event: any) => {
  filters.page = $event;
  props.refresh(); // Call parent's refresh function
}
</script>

<style scoped>
.document-align {
  margin-top: 40px;
}
</style>