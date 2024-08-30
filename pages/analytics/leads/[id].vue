<template>
  <Page :title="leadData?.botUser?.name ?? ''" :disable-back-button="false" :disable-elevation="true">
    <template #actionButtons>
      <div class="flex items-center gap-3">
        <UiButton v-if="leadData?.lead?.status === 'default'" variant="destructive" @click="() => changeStatus = true">
          Mark as Junk
        </UiButton>
        <UiButton v-else class="bg-[#424cd1] hover:bg-[#424bd1] hover:brightness-90" @click="() => revertStatus = true">
          Revert
        </UiButton>
        <ConfirmationModal v-model:open="revertStatus" title="Confirm revert status"
          description="Are you sure you want to revert the status ?" @confirm="confirmChangeStatus('default')" />
        <ConfirmationModal v-model:open="changeStatus" title="Confirm Change Status"
          description="Are you sure about the status change ?" @confirm="confirmChangeStatus('junk')" />
        <!-- @confirm="handleLogout" -->
      </div>
    </template>
    <div class="items-top xs:grid-cols-2 flex grid grid-cols-1 gap-[25px] lg:grid-cols-2">
      <!-- mx-8 -->
      <div class="flex w-full justify-aro und gap-8 sm:w-full md:w-[70%] lg:w-[90%] xl:w-[90%]">
        <UiTabs default-value="client" class="w-full self-start">
          <UiTabsList class="grid w-full grid-cols-2">
            <UiTabsTrigger value="client"> Client Info </UiTabsTrigger>
            <UiTabsTrigger value="campaign"> Campaign Info </UiTabsTrigger>
          </UiTabsList>
          <UiTabsContent value="client">
            <div class="flex grid grid-cols-2 flex-col items-center gap-2 pl-4 capitalize">
              <div v-for="[key, value] in details[0]" class="max-w-full font-medium">
                <div class="max-w-[100%] truncate">
                  <div class="text-gray-500">{{ key }}</div>
                  <div class="w-[90%]">
                    <a v-if="key === 'Mobile'" href="tel:{{ value }}" class="truncate text-[#424bd1]">
                      {{ value }}
                    </a>
                    <a v-else-if="key === 'Email'" href="mailto:{{ value }}"
                      class="lowercase truncate block text-[#424bd1]">
                      {{ value }}
                    </a>
                    <div v-else class="truncate">
                      {{ value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UiTabsContent>
          <UiTabsContent value="campaign">
            <div class="flex grid grid-cols-2 flex-col items-center gap-2 pl-4 capitalize">
              <div v-for="[key, value] in details[1]" class="max-w-full font-medium">
                <div class="max-w-[100%] truncate">
                  <div class="text-gray-500">{{ key }}</div>
                  <div class="truncate w-[90%]">
                    {{ value }}
                  </div>
                </div>
              </div>
            </div>
          </UiTabsContent>
        </UiTabs>
      </div>
      <div
        class="field_shadow h-[74vh] w-full overflow-hidden rounded-lg bg-[#ffffff] sm:w-full md:w-full lg:w-[100%] xl:w-[100%]">
        <div :class="[
            'flex items-center justify-between font-medium w-full h-[70px] text-[#ffffff] px-2.5',
          ]" :style="`background:hsl(${leadData?.bot.metadata.ui?.color?.replaceAll(' ', ',')})`">
          <div class="flex items-center gap-2">
            <span class="text-[14px] capitalize">{{
              leadData?.bot?.name
              }}</span>
          </div>
        </div>
        <div class="bg-[#f8f6f6] h-[65vh] overflow-y-scroll">
          <div class="w-full p-5" v-for="(messageList, messageIndex) in leadData?.messages.slice(1)"
            :key="messageIndex">
            <div v-if="messageList.role === 'comment'" class="relative">
              <div
                class="absolute left-1/2 top-1/2 h-[0.5px] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500/50">

              </div>
              <p class="relative mx-auto w-fit rounded-sm border bg-gray-100 px-2 py-1 text-xs font-thin">
                {{ messageList.content }}
              </p>
            </div>
            <!-- User Message -->
            <div class="flex flex-col items-center w-full" v-if="messageList.role === 'user'">
              <div class="flex flex-col items-end justify-center max-w-[80%]">
                <span class="text-[14px]" style="color: #8a8a8a">{{
                  leadData?.botUser?.name
                  }}</span>
                <div
                  class="flex flex-col items-end justify-center rounded-l-xl rounded-br-xl bg-[#ffffff] p-2.5 text-black mt-2.5">
                  <div>
                    {{ messageList.content }}
                  </div>
                </div>
                <div class="text-[12px] opacity-60">
                  {{ formatDate(new Date(messageList.createdAt), "hh:mm a") }}
                </div>
              </div>
            </div>
            <!-- Assistant Message -->
            <div class="w-[90%]" v-if="messageList.role === 'assistant'">
              <span class="text-[14px]" style="color: #8a8a8a">{{
                leadData?.bot.metadata.prompt.NAME
                }}</span>
              <!-- ai-reply-align -->
              <div
                class="flex flex-col gap-2 rounded-r-xl rounded-bl-xl mt-2.5 min-h-[80px] bg-[#ffffff] field_shadow p-5">
                <MdText :content="JSON.parse(messageList.content).response" />
                <div class="flex flex-col">
                  <div class="flex flex-wrap items-center gap-2">
                    <div class="flex items-center" v-for="(btn, btnIndex) in JSON.parse(messageList.content)
                        .canned" :key="btnIndex">
                      <p class="w-auto rounded-xl p-2" :style="{
                          // background: `hsl(347 66 39/ 0.15)`,
                          background: `hsl(${leadData?.bot.metadata.ui?.color?.replaceAll('%', ' ')}/0.15)`,
                          color: `hsl(${leadData?.bot.metadata.ui?.color?.replaceAll(' ', ',')})`,
                        }">
                        {{ btn.title }}
                      </p>
                    </div>
                  </div>
                  <div class="self-end text-[12px] text-[#00000066]">
                    {{ formatDate(new Date(messageList.createdAt), "hh:mma") }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
  <ConfirmationModal v-model:open="isDeleteConfirmationOpen" title="Confirm Delete"
    :description="`Are you sure you want to delete this lead - ${leadData?.botUser?.name} ?`" @confirm="handleDelete" />
</template>

<script setup lang="ts">
  import MdText from "~/components/MdText.vue";
  definePageMeta({
    middleware: "admin-only",
  });

  const router = useRouter();
  const route = useRoute("leads-id");
  const paramId: any = route;
  const changeStatus = ref(false)
  const revertStatus = ref(false)

  const { status, data: leadData } = await useLazyFetch(
    () => `/api/org/chat/${route.params.id}`,
    {
      server: false,
    },
  );
  const isPageLoading = computed(() => status.value === "pending");

  const details = computed(() => {
    if (!leadData.value) return [];
    const { params, ...rest } = leadData.value.metadata as Record<string, any>;
    const { name } = leadData.value.bot
    let metaData: any = Object.entries(rest).map(([key, value]) => {
      
      if (key === "os") {
        return ["OS", value];
      } else if (key === "ipAddress") {
        return ["IP Address", value];
      }
      return [key, value];
    });
    metaData = [
      ...metaData,
      ["Name", leadData?.value?.botUser?.name],
      ["Email", leadData?.value?.botUser?.email],
      ["Mobile", leadData?.value?.botUser?.mobile],
      ["Bot Name", name]
    ];
    return [metaData, Object.entries(params)];
  });

  const isDeleteConfirmationOpen = ref(false);
  
  const handleDelete = async () => {
    isDeleteConfirmationOpen.value = false;
    await $fetch(`/api/org/lead/${leadData.value?.lead?.id}`, {
      method: "DELETE",
    });
    return navigateTo({ name: "leads" });
  };

const confirmChangeStatus = async (value: any) => {
  await useLazyFetch(`/api/org/lead/${leadData.value?.lead?.id}`, {
    method: "PUT",
    body: { status: value },
  });
}
</script>
