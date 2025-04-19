<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <div class="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-bold"> Intent Management </div>
      <UiButton class="text-[12px] sm:text-[12px] md:text-[14px]" color="primary" @click="addNewIntents">
        Add Intents
      </UiButton>
    </div>
    <CreateEditIntentModal v-model="intentDialogState" @success="intentRefresh()" />

    <DataTable :columns="columns" :data="intentData" :totalPageCount="totalPageCount" :page="page"
      :totalCount="totalCount" :page-size="8" :is-loading="isIntentLoading" :height="20" height-unit="vh" />
    <ConfirmationModal v-model:open="deleteIntentDialogState.open" title="Confirm Delete"
      description="Are you sure you want to delete this intent ?" @confirm="
        async () => {
          await deleteIntent({
            payload: {
              botId: `${route.params.id}`,
              intentId: deleteIntentDialogState.id,
            },
            onSuccess: () => {
              intentRefresh();
              deleteIntentDialogState.open = false;
            },
          });
        }
      " />
  </div>
</template>
<script setup lang="ts">
import { Icon, UiButton } from "#components";
import { createColumnHelper } from "@tanstack/vue-table";
import CreateEditIntentModal from "~/components/bots/CreateEditIntentModal.vue";
import { useRoute, useRouter } from "vue-router";
import { deleteIntent } from "~/utils/apis/intent-management"

const intentDialogState = ref({ open: false, id: null });
const selectedActions = ref("location");
const animationProps = {
  duration: 0,
};
const router = useRouter();
const route = useRoute();
const page = ref(1);
const totalPageCount = ref(1);
const totalCount = ref(1);
const {
  data: intentData,
  status: intentLoadingStatus,
  refresh: intentRefresh,
} = useLazyFetch(() => `/api/bots/${route.params?.id}/intents`, {
  server: false,
  default: () => [],
  transform: (intents) => {
    return intents.map((intent) => ({
      id: intent.id,
      link: intent.link,
      intent: intent.intent,
      createdAt: formatDate(new Date(intent?.createdAt), "dd.MM.yyyy"),
    })) ?? [];
  }
});
const props = defineProps<{ botDetails: any; refreshBot: () => void }>();

const isIntentLoading = computed(
  () => intentLoadingStatus.value === "pending",
);

const deleteIntentDialogState: any = ref({
  open: false,
  id: "",
});
const columnHelper = createColumnHelper<(typeof intentData.value)[0]>();
const actionsComponent = (id: string) =>
  h(
    "div",
    {
      class: "flex items-center gap-2",
    },
    [
      h(
        UiButton,
        {
          color: "primary",
          class: "ml-2",
          onClick: () => {
            intentDialogState.value.open = true;
            intentDialogState.value.id = id;
          },
        },
        h(Icon, { name: "lucide:pen" }),
      ),
      h(
        UiButton,
        {
          variant: "destructive",
          onClick: () => {
            deleteIntentDialogState.value.open = true;
            deleteIntentDialogState.value.id = id;
          },
        },
        h(Icon, { name: "lucide:trash-2" }),
      ),
    ],
  );
const columns = [
  columnHelper.accessor("intent", {
    header: "Intent Name",
  }),
  columnHelper.accessor("link", {
    header: "Link",
    cell: (info) => {
      const value = info.getValue() || "--";
      return h(
        "div",
        { class: "max-w-[350px] truncate", title: value },
        value
      );
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Date Created",
  }),
  columnHelper.accessor("actions", {
    header: "actions",
    cell: ({ row }) => {
      return actionsComponent(row.original.id);
    },
  }),
];
const addNewIntents = () => {
  if (props.botDetails?.metadata?.ui?.generateLead) {
    intentDialogState.value.open = true;
    intentDialogState.value.id = null;
  } else {
    toast.error("Please enable lead generation in UI customization");
  }
};

</script>