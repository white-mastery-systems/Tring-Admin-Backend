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
            <UiTabsList class="grid w-full grid-cols-1">
              <UiTabsTrigger value="Client"> Client Info </UiTabsTrigger>
              <!-- <UiTabsTrigger value="Campaign"> Campaign info</UiTabsTrigger> -->
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
              <div class="flex justify-center mt-4">
                <div class="w-[53%] relative">
                  <!-- Loader is displayed when audio is loading -->
                  <div v-if="isAudioLoading"
                    class="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
                    <!-- Customize your loader -->
                    <!-- <template> -->
                    <Icon name="svg-spinners:90-ring-with-bg" class="h-6 w-6 animate-spin text-white" />
                    <!-- </template> -->
                  </div>

                  <div>
                    <audio controls
                      :src="`http://148.113.16.40:5050/recording/?bot_id=${callLogs.botId}&organization_id=${callLogs.organizationId}&sid=${callLogs.callSid}`"
                      @loadeddata="onAudioLoaded" @waiting="onAudioLoading" ref="audioPlayer">
                      Your browser does not support the audio element.
                    </audio>
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
          class="field_shadow h-screen-minus-11 w-full overflow-hidden rounded-lg bg-[#f8f6f6] sm:w-full md:w-full lg:w-[100%] xl:w-[100%]">
          <div :class="[
              'flex h-[70px] w-full items-center justify-between px-2.5 font-medium text-[#ffffff] bg-[#424bd1]',
            ]">
          </div>
          <ChatPreview :chatValue="[{meesages:callLogs?.callTranscription}]" :messageListCheck="false" />
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
const audioSrc = ref()
const audioElement = ref(null)
const isAudioLoading = ref(true)
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
    "Direction": callData.direction,
    "Session ID": callData.callSid,
    "Called At": formattedDate,
    "summary": callData.summary,
    // "Country Name": "",  // Static values
    // "State Prov": "", // Static values
    // "City": "", // Static values
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

onMounted(() => {
  audioElement.value = document.querySelector('audio')
})

const playAudio = () => {
  audioElement.value.play()
}

const pauseAudio = () => {
  audioElement.value.pause()
}

// const handleDownload = () =>{
//   const downloadLink = `https://5z2vwb9t-5000.inc1.devtunnels.ms/recording/?bot_id=${callLogs.value.botId}&organization_id=${callLogs.value.organizationId}&sid=${callLogs.value.callSid}`;

//   // Create a temporary link element for downloading
//   const link = document.createElement('a');
//   link.href = downloadLink;
//   link.download = 'recording.wav'; // Specify the desired file name
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }
const onAudioLoaded = () => {
  isAudioLoading.value = false
}
const onAudioLoading = () => {
  isAudioLoading.value = true
}
</script>
