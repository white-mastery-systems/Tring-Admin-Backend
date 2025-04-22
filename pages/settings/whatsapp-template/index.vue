<template>
  <Page title="Whatsapp Templates" :disable-back-button="true">
    <template #actionButtons>
      <div class="flex gap-4">
        <div class="flex gap-2">
          <UiButton color="primary" @click="
            () => {
              addWhatsappTemplateModalState.open = true;
              addWhatsappTemplateModalState.id = null;

              templateStore.resetValues();
            }
          ">
            Add Template
          </UiButton>
        </div>
      </div>
    </template>
    <div>
      <div class="flex items-center gap-2 pb-2">
        <WhatsappBotFilter @change="onTemplateChange" />
      </div>
      <DataTable @pagination="Pagination" @limit="
        ($event) => {
          (filters.page = '1'), (filters.limit = $event);
        }
      " :totalPageCount="totalPageCount" :page="page" :totalCount="totalCount" :data="whatsappTemplateList"
        :is-loading="isDataLoading" :columns="columns" :page-size="20" :height="20" height-unit="vh" />

      <ConfirmationModal v-model:open="deleteTemplateState.open" title="Confirm Delete"
        description="Are you sure you want to delete ?" @confirm="
          () => {
            if (deleteTemplateState?.obj.id) {
              deleteSingleTemplate({
                obj: deleteTemplateState.obj,
                onSuccess: () => {
                  integrationRefresh();
                },
              });
              deleteTemplateState.open = false;
            }
          }
        " />
    </div>
    <AddEditWhatsappTemplateModal v-if="addWhatsappTemplateModalState.open" v-model="addWhatsappTemplateModalState"
      @confirm="
        () => {
          addWhatsappTemplateModalState.open = false;
          integrationRefresh();
        }
      " />
  </Page>
</template>
<script setup lang="ts">
import { Icon, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
import { useTemplateStore } from "~/store/whatsAppTemplateStore";
const templateStore = useTemplateStore();

definePageMeta({
  middleware: "user",
});
useHead({
  title: "Contacts Management | Contacts",
});

const deleteTemplateState = ref({ open: false, obj: {} });

const filters = reactive<{
  q: string;
  page: string;
  limit: string;
}>({
  q: "",
  page: "1",
  limit: "10",
});
const addWhatsappTemplateModalState = ref({ open: false, id: null });

const page = ref(0);
const totalPageCount = ref(0);
const totalCount = ref(0);
const {
  status,
  data: whatsappTemplateList,
  refresh: integrationRefresh,
} = await useLazyFetch("/api/templates", {
  server: false,
  default: () => [],
  query: filters,
  transform: (data) => {
    // Transform the data to extract and format the templates
    return data?.templates?.map((template: any) => ({
      integrationId: data?.integrationId,
      name: template.name,
      status: template.status,
      id: template.id,
    }));
  },
});

const isDataLoading = computed(() => status.value === "pending");
const columnHelper = createColumnHelper<(typeof whatsappTemplateList.value)[0]>();

const actionsComponent = (templateObj: any) =>
  h(
    "div",
    {
      class: "flex items-center gap-2",
    },
    [
      h(
        UiButton,
        {
          onClick: (e: any) => {
            e.stopPropagation();
            deleteTemplateState.value.obj = templateObj;
            deleteTemplateState.value.open = true;
          }, // Add delete functionality
          class: "bg-[#f44336] hover:bg-[#f44336] font-bold", // Different color for delete
        },
        h(Icon, { name: "lucide:trash-2" }),
      ),],
  );

const columns = [
  columnHelper.accessor("name", {
    header: "Template Name",
  }),
  columnHelper.accessor("status", {
    header: "status",
    cell: ({ row }) => row.original?.status.toLowerCase(),
  }),

  columnHelper.accessor("id", {
    header: "Action",
    cell: ({ row }) => {
      return actionsComponent(row.original);
    },
  }),
];

const Pagination = async ($evnt) => {
  filters.page = $evnt;
  integrationRefresh();
};
const onTemplateChange = (value: any) => {
  filters.q = value
};
</script>
