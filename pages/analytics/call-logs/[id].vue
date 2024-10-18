<template>
  <!-- <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div> -->
  <!-- v-else -->
  <!-- leadData?.botUser?.name ??  -->
  <Page :title="'No Name'" :disable-back-button="false" :disable-elevation="true">
    <div class="items-top gap-[25px flex items-center justify-center px-3">
      <div class="items-top xs:grid-cols-2 flex grid w-full grid-cols-1 gap-[25px] lg:grid-cols-2">
        <div class="justify-aro und flex w-full gap-8 sm:w-full md:w-[70%] lg:w-[90%] xl:w-[90%]">
          <UiTabs default-value="Client" class="w-full self-start">
            <UiTabsList class="grid w-full grid-cols-2">
              <UiTabsTrigger value="Client"> Client Info </UiTabsTrigger>
              <UiTabsTrigger value="Campaign"> Campaign info</UiTabsTrigger>
            </UiTabsList>
            <UiTabsContent value="Client">
              <!-- {{formattedCallData}} || asfa -->
              <div class="flex grid grid-cols-2 flex-col items-center gap-2 pl-4 capitalize">
                <div v-for="(value, key) in formattedCallData" :key="key">
                  <div class="gap-2 pl-4 capitalize max-w-full">
                    <div class="text-gray-500 font-medium">{{ key }}</div>
                    <div :class="['font-medium', (key === 'Session ID') ? 'truncate w-45' : '']">{{ value }}</div>
                  </div>
                </div>
              </div>
            </UiTabsContent>
            <UiTabsContent value="Campaign">
            </UiTabsContent>
            <!-- </div> -->
          </UiTabs>
        </div>
        <div v-if="true"
          class="field_shadow h-screen-minus-11 w-full overflow-hidden rounded-lg bg-[#ffffff] sm:w-full md:w-full lg:w-[100%] xl:w-[100%]">

          <ChatPreview :chatValue="callLogs?.callTranscription" />
        </div>
      </div>
    </div>
    <!-- <input type="text" value="hii" ref="chatScreenRef" /> -->
  </Page>
</template>
<script setup lang="ts">

// const scrollChatBox = () => {
//   setTimeout(() => {
//     if (chatScreenRef.value)
//       chatScreenRef.value.scrollTop = chatScreenRef?.value?.scrollHeight;
//   }, 1000);
// };

definePageMeta({
  middleware: "admin-only",
});

const route = useRoute("analytics-call-logs-id");

// const chats = await $fetch(`/api/call-logs/${route.params.id}`, {
//   method: "GET",
//   server: false,
// });
const { status, data: callLogs } = await useLazyFetch(
  () => `/api/call-logs/${route.params.id}`,
  {
    server: false,
  },
);

const formattedCallData = computed(() => {
  if (!callLogs.value) return null; // Handle the case where callLogs might be undefined

  // Access the single call log directly
  const callData = callLogs.value;

  // Format the date for display
  const date = new Date(callData.date);
  const formattedDate = date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  // Return a flat object with key-value pairs
  return {
    "From": callData.from,
    "To": callData.exophone,
    "Call Duration": `${Math.round(callData.duration)} Secs`,
    "Direction": callData.direction === 'inbound' ? 'Incoming' : 'Outgoing',
    "Session ID": callData.callSid,
    "Called At": formattedDate,
    "Country Name": "India",  // Static values
    "State Prov": "Maharashtra", // Static values
    "City": "Navi Mumbai", // Static values
  };
});
// const { status, data: leadData } = await useLazyFetch(
//   () => `/api/org/chat/${route.params.id}`,
//   {
//     server: false,
//   },
// );

// watchEffect(() => {
//   if (leadData.value) {
//     const userName = leadData.value?.botUser?.name ?? "Unknown User";
//     useHead({
//       title: `Chats | ${userName}`,
//     });
//   }
// });
// const isPageLoading = computed(() => status.value === "pending");

const details = computed(() => {

  // const { params, ...rest } =
  //   leadData.value?.metadata ?? ({ params: null } as Record<string, any>);
  // const { name } = leadData.value.bot;
  // let metaData: any = Object.entries(rest || {}).map(([key, value]) => {
  //   if (key === "os") {
  //     return ["OS", value];
  //   } else if (key === "ipAddress") {
  //     return ["IP Address", value];
  //   }
  //   return [key, value];
  // });
  // const botUserDetails = [];
  // if (leadData?.value.botUser) {
  //   botUserDetails.push(
  //     ["Name", leadData?.value?.botUser?.name],
  //     ["Email", leadData?.value?.botUser?.email],
  //     [
  //       "Mobile",
  //       leadData?.value?.botUser?.countryCode +
  //       leadData?.value?.botUser?.mobile,
  //     ],
  //     ["Bot Name", name],
  //   );
  // }
  // let paramsData = null;
  // if (params) {
  //   paramsData = Object.entries(params);
  // }
  // if (paramsData) {
  //   return [...metaData, ...paramsData, ...botUserDetails];
  // } else return [...metaData, ...botUserDetails];
});
</script>
