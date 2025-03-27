<template>
  <DataTable 
    @pagination="Pagination" 
    @limit="($event) => {
      (filters.page = '1'), (filters.limit = $event);
    }"
    :totalPageCount="totalPageCount" 
    :page="page" 
    :totalCount="totalCount" 
    :columns="TTsColumns"
    :data="integrationsData" 
    :page-size="8" 
    :is-loading="false" 
    :height="20" 
    :heightUnit="'vh'" 
  />
  <!-- Pass the ttsModalState to the TTSModal component with v-model binding -->
  <TTSModal 
    :ttsModalState="ttsModalState"
    @success="onSuccess()" />
  
  <!-- Confirmation Modal for Delete -->
  <ConfirmationModal 
    v-model:open="deleteExoPhoneState.open" 
    title="Confirm Delete"
    description="Are you certain you want to delete the Exophone integration? Please note that doing so will also remove all bots associated with this number?"
    @confirm="() => {
      deleteSingleTTSIntegration({
        id: deleteExoPhoneState.id,
        onSuccess: () => {
          integrationRefresh();
        },
      });
      deleteExoPhoneState.open = false;
    }" 
  />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { createColumnHelper } from "@tanstack/vue-table";
import { useCount } from '@/composables/useRefresh';
import { Icon, UiBadge, UiButton } from "#components";
import TTSModal from "~/pages/integration/TTSModal.vue";
import { useIntegrations } from '@/composables/botManagement/voiceBot/useTtsIntegrations';
// import TTSModal from "~/pages/integration/TTSModal.vue";

definePageMeta({
  middleware: "admin-only",
});

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

// let page = ref(0);
// let totalPageCount = ref(0);
// let totalCount = ref(0);

const router = useRouter();
const route = useRoute();

// Define props
const props = defineProps<{ integrationModalState?: boolean }>();

// Define ttsModalState as a reactive object with correct property types
const ttsModalState = reactive({ 
  open: false, 
  id: null 
});

let deleteExoPhoneState = reactive({
  open: false,
  id: null,
});

const emit = defineEmits<{
  (e: "action", id: any, modelControl: string): void;
  (e: 'pagenation', page: number): void;
  (e: 'limitChange', limit: string): void;
  (e: 'stateControl', payload: any): void;
}>();

const { 
  integrationsData, 
  status, 
  integrationRefresh,
  page,
  totalPageCount,
  totalCount
} = useIntegrations(filters);
// Fetch integrations data
// const {
//   data: integrationsData,
//   status,
//   refresh: integrationRefresh,
// } = await useLazyFetch("/api/tts-integration", {
//   server: false,
//   default: () => [],
//   query: filters,
//   transform: (integrations: any) => {
//     console.log(integrations, "integrations");
//     page.value = integrations.page;
//     totalPageCount.value = integrations.totalPageCount;
//     totalCount.value = integrations.totalCount;
//     return integrations.data;
//   },
// });

// Watch for integrationModalState changes to update ttsModalState
watch(() => props.integrationModalState, (newValue: any) => {
  console.log(newValue, "newValue TTS Integration");
  if (newValue !== undefined) {
    ttsModalState.open = Boolean(newValue);
    ttsModalState.id = null;
  }
});

// Watch for ttsModalState.open changes to emit stateControl
watch(() => ttsModalState.open, (newValue) => {
  console.log("TTS Modal open changed to:", newValue);
  if (newValue === false) {
    emit("stateControl", false);
  }
});

// Create the actions component for the table
const actionsComponent = (id: any) => h(
  "div",
  {
    class: "flex items-center gap-2",
  }, [
  h(UiButton, {
    color: "primary",
    onClick: () => {
      console.log("Edit TTS Integration", id);
      ttsModalState.open = true;
      ttsModalState.id = id;
      emit("action", id, 'edit');
    },
    class: "bg-[#f44336] hover:bg-[#f44336] font-bold",
  },
    h(Icon, { name: "lucide:pen" }),
  ),
  h(
    UiButton,
    {
      variant: "destructive",
      onClick: () => {
        emit("action", id, 'delete');
        deleteExoPhoneState.open = true;
        deleteExoPhoneState.id = id;
      },
    },
    h(Icon, { name: "lucide:trash-2" })
  )
]);

// Define table columns
const columnHelper = createColumnHelper<any>();
const TTsColumns = [
  columnHelper.accessor("provider", {
    header: "Provider",
  }),
  columnHelper.accessor("ttsIntegrationName", {
    header: "Integration Name",
  }),
  columnHelper.accessor("id", {
    header: "Action",
    cell: ({ row }) => {
      return actionsComponent(row.original.id);
    }
  }),
];

// Handle pagination
const Pagination = async ($event: any) => {
  filters.page = $event;
};

// Handle modal success
const onSuccess = () => {
  ttsModalState.open = false;
  integrationRefresh();
};

// Function to delete exophone
// const deleteSingleExoPhone = async ({ id, onSuccess }: { id: number, onSuccess: () => void }) => {
//   try {
//     await $fetch(`/api/org/integrations/number-integration/${id}`, {
//       method: 'DELETE'
//     });
//     onSuccess();
//   } catch (error) {
//     console.error('Error deleting exophone:', error);
//   }
// };
</script>