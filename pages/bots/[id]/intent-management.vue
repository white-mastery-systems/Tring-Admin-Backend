<script setup lang="ts">
  import { Icon, UiButton } from "#components";
  import { createColumnHelper } from "@tanstack/vue-table";

  const showIntentDialog = ref(false);

  const animationProps = {
    duration: 0,
  };
  const router = useRouter();
  const route = useRoute("bots-id-intent-management");

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
  console.log({ intentData });
  const isIntentLoading = computed(
    () => intentLoadingStatus.value === "pending",
  );

  const botDetails: any = await getBotDetails(route.params.id);
  const defaultFormValues = botDetails.metadata.prompt;

  const addIntents = async (values: any) => {
    const intentDetails: any = {
      id: botDetails.id,
      ...values,
    };
    await createBotIntents({
      intentDetails,
      onSuccess: () => {
        showIntentDialog.value = false;
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
      name: "bots-id",
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
      UiButton,
      {
        variant: "destructive",
        onClick: () => {
          deleteIntentDialogState.value.open = true;
          deleteIntentDialogState.value.id = id;
        },
      },
      h(Icon, { name: "lucide:trash-2" }),
    );
  const columns = [
    columnHelper.accessor("intent", {
      header: "Intent Name",
    }),
    columnHelper.accessor("link", {
      header: "Link",
    }),
    columnHelper.accessor("createdAt", {
      header: "Date Created",
    }),
    columnHelper.accessor("actions", {
      header: "actions",
      cell: ({ row }) => {
        console.log({ row });
        return actionsComponent(row.original.id);
      },
    }),
  ];
</script>
<template>
  <Page
    title="Intent Mangement"
    :bread-crumbs="[
      { label: `${botDetails.name}`, to: `/bots/${botDetails.id}` },
      {
        label: 'Intent Management',
        to: `/bots/${botDetails.id}/intent-management`,
      },
    ]"
    :disableSelector="true"
    :disable-back-button="false"
  >
    <template #actionButtons>
      <div class="mb-4 flex items-center justify-end">
        <UiButton
          class="bg-yellow-500"
          type="button"
          @click="showIntentDialog = true"
          color="primary"
          >Add Intents</UiButton
        >

        <UiDialog v-model:open="showIntentDialog">
          <UiDialogContent class="sm:max-w-[425px]">
            <UiForm class="flex flex-col gap-2" @submit="addIntents">
              <UiDialogHeader>
                <UiDialogTitle class="text-indigo-600"
                  >Add Intents</UiDialogTitle
                >
              </UiDialogHeader>
              <UiFormField v-slot="{ componentField }" name="intent">
                <UiFormItem v-auto-animate="animationProps" class="w-full">
                  <UiFormLabel
                    >Actions<UiLabel class="text-lg text-red-500">*</UiLabel>
                  </UiFormLabel>
                  <UiFormControl>
                    <UiSelect v-bind="componentField">
                      <UiSelectTrigger>
                        <UiSelectValue placeholder="Select Intent" />
                      </UiSelectTrigger>
                      <UiSelectContent>
                        <UiSelectItem value="location">Location</UiSelectItem>
                        <UiSelectItem value="virtual_tour"
                          >Virtual Tour</UiSelectItem
                        >
                        <UiSelectItem value="schedule_call"
                          >Schedule Call</UiSelectItem
                        >
                        <UiSelectItem value="site_visit"
                          >Schedule Site Visit</UiSelectItem
                        >
                      </UiSelectContent>
                    </UiSelect>
                    <UiFormField
                      v-if="componentField.modelValue === 'Other'"
                      v-slot="{ componentField }"
                      name="link"
                    >
                      <UiFormItem
                        v-auto-animate="animationProps"
                        class="w-full"
                      >
                        <UiFormControl>
                          <UiInput v-bind="componentField" type="text" />
                        </UiFormControl>
                        <UiFormMessage />
                      </UiFormItem>
                    </UiFormField>
                  </UiFormControl>
                  <UiFormMessage />
                  <span class="text-xs text-gray-500">Select your intent.</span>
                </UiFormItem>
              </UiFormField>
              <UiFormField v-slot="{ componentField }" name="link">
                <UiFormItem v-auto-animate="animationProps" class="w-full">
                  <UiFormLabel
                    >Add Link <UiLabel class="text-lg text-red-500">*</UiLabel>
                  </UiFormLabel>
                  <UiFormControl>
                    <UiInput
                      v-bind="componentField"
                      type="text"
                      placeholder="Eg: enter your preferred value"
                    />
                  </UiFormControl>
                  <span class="text-xs text-gray-500">Enter intent link</span>
                  <UiFormMessage />
                </UiFormItem>
              </UiFormField>

              <UiDialogFooter>
                <UiButton
                  class="bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110"
                  type="submit"
                >
                  Save changes
                </UiButton>
              </UiDialogFooter>
            </UiForm>
          </UiDialogContent>
        </UiDialog>
      </div>
    </template>

    <DataTable
      :columns="columns"
      :data="intentData"
      :page-size="8"
      :is-loading="isIntentLoading"
    />
    <ConfirmationModal
      v-model:open="deleteIntentDialogState.open"
      title="Confirm Delete"
      description="Are you sure you want to delete this intent ?"
      @confirm="
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
      "
    />
  </Page>
</template>
