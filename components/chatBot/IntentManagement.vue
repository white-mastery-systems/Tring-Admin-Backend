<template>
  <!-- title="Intent Mangement" :bread-crumbs="[
  {
  label: `${botDetails.name}`,
  to: `/bot-management/chat-bot/${botDetails.id}`,
  },
  {
  label: 'Intent Management',
  to: `/bot-management/chat-bot/${botDetails.id}/intent-management`,
  },
  ]" :disableSelector="true" :disable-back-button="false" -->
  <div>
    <!-- <template #actionButtons> -->
    <div class="mb-4 flex items-center justify-between">
      <div class="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-bold"> Intent Management </div>
      <UiButton class="text-[12px] sm:text-[12px] md:text-[14px]" color="primary" @click="addNewIntents">
        Add Intents
      </UiButton>
    </div>
    <!-- </template> -->
    <CreateEditIntentModal v-model="intentDialogState" @success="intentRefresh()" />

    <DataTable :columns="columns" :data="intentData" :totalPageCount="totalPageCount" :page="page"
      :totalCount="totalCount" :page-size="8" :is-loading="isIntentLoading" :height="20" height-unit="vh" />
    <ConfirmationModal v-model:open="deleteIntentDialogState.open" title="Confirm Delete"
      description="Are you sure you want to delete this intent ?" @confirm="
        async () => {
          await deleteIntent({
            payload: {
              botId: route.params.id,
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

const intentDialogState = ref({ open: false, id: null });
const selectedActions = ref("location");
const animationProps = {
  duration: 0,
};
const router = useRouter();
const route = useRoute();
let page = ref(1);
let totalPageCount = ref(1);
let totalCount = ref(1);
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
const intents: any[] = [];
if(props.botDetails.metadata.prompt.INTENTS || props.botDetails.metadata.prompt.intents){
  const splitIntents = `${props.botDetails.metadata.prompt.INTENTS || props.botDetails.metadata.prompt.intents}`.split("\n")
  intents.push(...splitIntents.filter((intent) => `${intent.trim().toLowerCase()}` !== "other"));
}

watchEffect(() => {
  // Set data only if API didn’t return anything and we have local fallback
  if (!intentData.value.length && intents.length) {
    intentData.value = intents.map((intent, index) => ({
      id: `${index}`,
      link: "--",
      intent: intent,
      createdAt: formatDate(new Date(), "dd.MM.yyyy"),
    }));
  }
});

// const { accordionItems, updateStepStatus } = useStepStatus(route);

const isIntentLoading = computed(
  () => intentLoadingStatus.value === "pending",
);

// const botDetails: any = await getBotDetails(route.params.id);
// const { botDetails, loading, error, refreshBot } = useBotDetails(route.params?.id);
// const { documentsList, refreshDocuments } = useDocumentsList(route.params.id);
// const defaultFormValues = botDetails.value.metadata.prompt;

// watch(
//   () => botDetails.value?.name, // Watching only the 'name' property
//   (newName) => {
//     const userName = newName ?? "Unknown Bot Name";
//     useHead({
//       title: `Chat Bot | ${userName} - Intent Management`,
//     });
//   },
//   { immediate: true } // Runs immediately on mount
// );

// watch(intentData, (newValue) => {

//   if (newValue && typeof newValue === "object") {
//     const length = Object.keys(newValue).length;

//     refreshDocuments()
//     if (length <= 1 ) {
//       updateStepStatus("botConfiguration", "completed");
//     }
//   }
// });


// const handleIntentDataListChecking = (newValue: any) => {
//   if (newValue && typeof newValue === "object") {
//     const length = Object.keys(newValue).length;

//     if (length <= 1) {
//       updateStepStatus("botConfiguration", "completed");
//     }
//   }
// }

// const addIntents = async (values: any) => {
//   const intentDetails: any = {
//     id: botDetails.value.id,
//     ...values,
//   };
//   await createBotIntents({
//     intentDetails,
//     onSuccess: () => {
//       intentDialogState.value.open = false;
//       toast.success("Intent added successfully");
//     },
//   });
//   intentRefresh();
// };
// const handleSubmit = async (values: any) => {
//   const payload: any = {
//     id: botDetails.value.id,
//     metadata: {
//       ...botDetails.value.metadata,
//       prompt: {
//         ...values,
//       },
//     },
//   };
//   await updateBotDetails(payload);
//   return navigateTo({
//     name: "chat-bot-id",
//     params: { id: botDetails.value.id },
//   });
// };
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
    // setTimeout(() => {
    //   navigateTo(`/bot-management/chat-bot/${botDetails.id}/ui-customization`);
    // }, 2000); // 2 seconds delay
  }
};

</script>