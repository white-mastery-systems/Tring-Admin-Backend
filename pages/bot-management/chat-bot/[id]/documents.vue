<template>
  <Page title="Document Management" :bread-crumbs="[
      {
        label: `${botDetails.name}`,
        to: `/bot-management/chat-bot/${botDetails.id}`,
      },
      {
        label: 'Document Management',
        to: `/bot-management/chat-bot/${botDetails.id}/documents`,
      },
    ]" :disableSelector="true" :disable-back-button="false" :disable-elevation="true">
    <div class="mb-[50px] sm:mb-[50px] md:mb-4 lg:mb-4 xl:mb-4">
      <div class="document-align">
        <span class="flex flex-row">
          <!-- @click="uploadfile" -->
          <DocumentUpload accept="application/pdf" v-model="selectedFile" @upload-document="fileUpload()" />
          <!-- <img src="assets\icons\upload _document.svg" width="100" /> -->
        </span>
      </div>
      <p class="pt-2 pb-6 text-sm text-gray-400">only PDF</p>
      <DataTable @pagination="Pagination" @limit="($event) => {
          (filters.page = '1'), (filters.limit = $event);
        }
        " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :columns="columns"
        :data="documentItems" :is-loading="isDataLoading" :page-size="20" :height="23" height-unit="vh" />
    </div>
    <!-- <BotDocumentMenu></BotDocumentMenu> -->
    <!-- <ConfirmationModal v-model:open="deleteDocumentModelOpen[list.id]" title="Confirm Delete"
      description="Are you sure you want to delete ?" @confirm="() => {
          handleAction(list, 'delete');
          deleteDocumentModelOpen[list.id] = false;
        }
        " /> -->
  </Page>
  <!-- <div v-if="isPageLoading" class="grid h-[80vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div> -->
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
  const route = useRoute("bot-management-chat-bot-id-documents");
  const paramId: any = route;
  const selectedFile = ref();
  const myPopover: any = ref(null);
  const botDetails: any = await getBotDetails(paramId.params.id);
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
} = await useLazyFetch(() => `/api/bots/${route.params.id}/documents`, {
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
          documentsRefresh();
        }
      }

      // Update your component state with the received data
    };
  });
  const isPageLoading = computed(() => status.value === "pending");

  watchEffect(() => {
    if (botDetails) {
      const userName = botDetails?.name ?? "Unknown Bot Name";
      useHead({
        title: `Chat Bot | ${userName} - Document Management`,
      });
    }
  });

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
    viewDocument(paramId.params.id, list.id);
  };
  const Pagination = async ($event: any) => {
    filters.page = $event
    documentsRefresh()
  }
</script>

<style scoped>
  .bot-manage-main-container {
    padding: 0 25px 70px 25px;
    height: 100%;
    overflow: hidden;
  }

  .header-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: segoe UI Regular;
  }

  .bot-main-align {
    padding: 20px;
    margin-top: 30px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    height: 70%;
    /* height: calc(100vh - 130px); */
    /* overflow-y: scroll; */
  }

  .content-align {
    /* width: 100px !important; */
    margin-bottom: 5px;
    color: rgba(138, 138, 138, 1);
  }

  .list-header-align {
    padding: 10px 62px;
    display: flex;
    /* justify-content: space-between; */
    width: 100%;
    /* gap: 100px; */
    border-bottom: 0.5px solid rgba(181, 181, 181, 1);
  }

  .list_align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 96%;
    /* background: rgba(255, 255, 255, 1); */
    /* padding: 30px 30px; */
    /* box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important; */
    border-radius: 10px;
    /* gap: 100px; */
    /* margin: 10px 0; */
  }

  .bot-list-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 1);
    padding: 20px 0px;
    width: 100% !important;
    /* height: calc(100vh - 260px); */
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.05) !important;
    border-radius: 10px;
    margin: 20px 0 0 0;
    font-size: 15px;
  }

  .acive_class {
    display: flex;
    align-items: center;
    color: rgba(26, 187, 0, 1);
    gap: 5px;
    padding-inline-end: 88px;
  }

  .deacive_class {
    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(255, 0, 0, 1);
    padding-right: 104px;
  }

  .process_class {
    display: flex;
    align-items: center;
    color: rgba(238, 186, 1, 1);
    gap: 5px;
    padding-inline-end: 70px;
  }

  .process-circle-align {
    display: flex;
    align-items: center;
    background: rgba(238, 186, 1, 1);
    width: 5px;
    height: 5px;
  }

  .active-circle-align {
    display: flex;
    align-items: center;
    background-color: rgba(26, 187, 0, 1);
    width: 5px;
    height: 5px;
  }

  .deactive-circle-align {
    display: flex;
    align-items: center;
    background-color: rgba(255, 0, 0, 1);
    width: 5px;
    height: 5px;
  }

  .header-content-align {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .bot_name_align {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    padding-inline-start: 30px;
  }

  /* .create_at-align {
    padding-inline-end: 130px;
  } */

  .document-align {
    display: flex;
    align-items: center;
    margin-top: 40px;
  }

  .upload-document-align {
    color: rgba(66, 75, 209, 1);
    font-size: 15px;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .only-content-align {
    color: rgba(138, 138, 138, 1);
    font-size: 11px;
  }

  .content-scroll-align {
    height: 90%;
    /* height: calc(100vh - 350px); */
    overflow-y: scroll;
    padding: 0 15px;
  }

  .overflow_align {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* height: 90%; */
    overflow-y: scroll;
    width: 100%;
    padding: 5px 15px 40px 15px;
  }

  .submit-btn-align button {
    width: 200px;
    height: 40px;
    border-radius: 10px;
    padding: 0 20px;
    background: #424bd1;
    color: #ffffff;
    /* margin-top: 20px; */
    /* margin-right: 170px; */
  }

  .menu-align {
    cursor: pointer;
    padding: 5px;
    font-weight: 500;
  }

  .active_class {
    position: relative;
  }

  .active-row::after {
    content: "Active";
    height: fit-content;
    width: fit-content;
    position: absolute;
    left: 30px;
    font-size: 10px;
    top: 5px;
    padding: 2px 5px;
    border-radius: 5px;
    color: white;
    background: rgb(7, 190, 7);
  }

  /* :deep(.line-clamp-3) {
    display: none;
  } */
</style>
