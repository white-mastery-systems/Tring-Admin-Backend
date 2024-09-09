<template>
  <Page
    title="Document Management"
    :bread-crumbs="[
      {
        label: `${botDetails.name}`,
        to: `/bot-management/chat-bot/${botDetails.id}`,
      },
      {
        label: 'Document Management',
        to: `/bot-management/chat-bot/${botDetails.id}/documents`,
      },
    ]"
    :disableSelector="true"
    :disable-back-button="false"
    :disable-elevation="true"
  >
    <div class="bot-manage-main-container">
      <div class="document-align">
        <span class="flex flex-row">
          <!-- @click="uploadfile" -->
          <FileUpload
            accept="application/pdf"
            v-model="selectedFile"
            @upload-document="fileUpload()"
          />
          <!-- <img src="assets\icons\upload _document.svg" width="100" /> -->
        </span>
        <!-- <div class="flex items-center gap-2">
        <div class="submit-btn-align">
          <button
            v-if="selectedFile"
            class="text-[14px] font-bold"
            type="submit"
            @click="fileUpload"
          >
            Upload Document
          </button>
        </div>
      </div> -->
      </div>
      <p class="pt-2 text-sm text-gray-400">only PDF</p>

      <div class="bot-main-align rounded-lg">
        <div class="list-header-align">
          <div class="header-content-align">
            <span class="content-align font-semibold">File Name</span>
            <span class="content-align font-semibold">Uploaded Date</span>
            <span class="content-align font-semibold">Status</span>
            <span class="content-align font-semibold">Actions</span>
          </div>
        </div>
        <!-- {{ getDocumentList }} -->
        <div class="content-scroll-align px-3">
          <!-- @click="async () => {
        await navigateTo('botpdfdocument')
        }" -->

          <div v-if="documents?.documents?.length" class="overflow_align">
            <div
              class="bot-list-align relative overflow-hidden text-[15px]"
              v-for="(list, index) in documents?.documents"
              :key="index"
              :class="{
                'active-row': list.id === documents?.documentId,
              }"
            >
              <!-- {{ list }} -->
              <div class="list_align">
                <span class="bot_name_align font-medium">{{ list.name }}</span>
                <span
                  class="create_at-align font-medium"
                  :style="{
                    'padding-inline-end':
                      list.status === 'ready'
                        ? '132px'
                        : list.status === 'processing'
                          ? '133px'
                          : '133px',
                  }"
                  >{{ list.createdAt }}</span
                >
                <div
                  v-if="list.status === 'ready'"
                  class="acive_class font-medium"
                >
                  <div class="active-circle-align rounded-full"></div>
                  <span>Success</span>
                </div>
                <div
                  v-else-if="list.status === 'processing'"
                  class="process_class font-medium"
                >
                  <div class="process-circle-align rounded-full"></div>
                  <span>Processing</span>
                </div>
                <div v-else class="deacive_class font-medium">
                  <div class="deactive-circle-align rounded-full"></div>
                  <span>Failed</span>
                </div>
                <span>
                  <UiPopover ref="myPopover">
                    <UiPopoverTrigger>
                      <img src="assets\icons\more_horiz.svg" width="30" />
                    </UiPopoverTrigger>
                    <UiPopoverContent align="end" class="w-40">
                      <div
                        @click="handleAction(list, 'download')"
                        class="menu-align rounded-sm text-center hover:bg-gray-300/20"
                      >
                        Download
                      </div>
                      <div
                        v-if="list.id !== documents?.documentId"
                        @click="deleteDocumentModelOpen = true"
                        class="menu-align rounded-sm text-center hover:bg-red-300/20 hover:text-red-500"
                      >
                        Delete
                      </div>
                      <ConfirmationModal
                        v-model:open="deleteDocumentModelOpen"
                        title="Confirm Delete"
                        description="Are you sure you want to delete ?"
                        @confirm="
                          () => {
                            handleAction(list, 'delete');
                            deleteDocumentModelOpen = false;
                          }
                        "
                      />
                    </UiPopoverContent>
                  </UiPopover>
                  <!-- <img src="assets\icons\more_horiz.svg" width="30"> -->
                </span>
              </div>
              <!-- <div>
              <img src="assets\icons\left_arrow.svg" width="30">
            </div> -->
            </div>
          </div>
          <div
            v-else
            class="font-regular flex h-[40Vh] items-center justify-center text-[#8A8A8A]"
          >
            No document available
          </div>
        </div>
      </div>
    </div>
  </Page>
  <!-- <div v-if="isPageLoading" class="grid h-[80vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div> -->
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: "admin-only",
  });

  import { ref } from "vue";
  const router = useRouter();

  const route = useRoute("bot-management-chat-bot-id-documents");
  const paramId: any = route;
  const selectedFile = ref();
  const myPopover: any = ref(null);
  const botDetails: any = await getBotDetails(paramId.params.id);
  // const documents = ref();
  const documentFetchInterval = ref<NodeJS.Timeout>();

  const deleteDocumentModelOpen = ref(false);

  const {
    status,
    refresh,
    data: documents,
  } = await useLazyFetch(() => `/api/bots/${route.params.id}/documents`, {
    server: false,
    transform: (docs) => ({
      ...docs,
      documents: docs?.documents.map((d) => ({
        ...d,
        createdAt: formatDate(new Date(d.createdAt), "dd.MM.yyyy"),
      })),
    }),
  });

  const isPageLoading = computed(() => status.value === "pending");

  const handleDeleteDocument = () => {
    deleteDocumentModelOpen.value = true;
  };
  const fileUpload = async () => {
    // selectedFile.value[0].name;
    //
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

    documentFetchInterval.value = setInterval(async () => {
      documents.value = await listDocumentsByBotId(paramId.params.id);
    }, 1000);
  };
  const handleAction = (list: any, action: any) => {
    if (myPopover.value) {
      myPopover.value = false;
    }

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
