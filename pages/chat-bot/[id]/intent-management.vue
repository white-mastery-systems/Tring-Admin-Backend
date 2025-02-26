<template>
  <Page title="Intent Mangement" :bread-crumbs="[
      {
        label: `${botDetails.name}`,
        to: `/bot-management/chat-bot/${botDetails.id}`,
      },
      {
        label: 'Intent Management',
        to: `/bot-management/chat-bot/${botDetails.id}/intent-management`,
      },
    ]" :disableSelector="true" :disable-back-button="false">
    <template #actionButtons>
      <div class="mb-4 flex items-center justify-end">
        <UiButton class="bg-yellow-500" type="button" @click="addNewIntents" color="primary">Add Intents
        </UiButton>
      </div>
    </template>
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
  </Page>
</template>
<script setup lang="ts">
  import { Icon, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";
  import CreateEditIntentModal from "~/components/bots/CreateEditIntentModal.vue";

  const intentDialogState = ref({ open: false, id: null });
  const selectedActions = ref("location");
  const animationProps = {
    duration: 0,
  };
  const router = useRouter();
  const route = useRoute("chat-bot-id-intent-management");
  let page = ref(1);
  let totalPageCount = ref(1);
  let totalCount = ref(1);

  const {
    status: intentLoadingStatus,
    refresh: intentRefresh,
    data: intentData,
  } = await useLazyFetch(() => `/api/bots/${route.params.id}/intents`, {
    server: false,
    default: () => [],
    transform: (intents) =>
      intents.map((intent) => ({
        id: intent.id,
        link: intent.link,
        intent: intent.intent,
        createdAt: formatDate(new Date(intent.createdAt), "dd.MM.yyyy"),
      })),
  });

  const isIntentLoading = computed(
    () => intentLoadingStatus.value === "pending",
  );

  const botDetails: any = await getBotDetails(route.params.id);
  const defaultFormValues = botDetails.metadata.prompt;

watch(
  () => botDetails?.name, // Watching only the 'name' property
  (newName) => {
    const userName = newName ?? "Unknown Bot Name";
    useHead({
      title: `Chat Bot | ${userName} - Intent Management`,
    });
  },
  { immediate: true } // Runs immediately on mount
);


  const addIntents = async (values: any) => {
    const intentDetails: any = {
      id: botDetails.id,
      ...values,
    };
    await createBotIntents({
      intentDetails,
      onSuccess: () => {
        intentDialogState.value.open = false;
        toast.success("Intent added successfully");
      },
    });
    intentRefresh();
  };
  const handleSubmit = async (values: any) => {
    const payload: any = {
      id: botDetails.id,
      metadata: {
        ...botDetails.metadata,
        prompt: {
          ...values,
        },
      },
    };
    await updateBotDetails(payload);
    return navigateTo({
      name: "chat-bot-id",
      params: { id: botDetails.id },
    });
  };
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
  if (botDetails.metadata.ui.generateLead) {
    intentDialogState.value.open = true;
    intentDialogState.value.id = null;
  } else {
    toast.error("Please enable lead generation in UI customization");
    setTimeout(() => {
      navigateTo(`/bot-management/chat-bot/${botDetails.id}/ui-customization`);
    }, 2000); // 2 seconds delay
  }
};

</script>