<template>
  <!-- <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div> -->
  <!-- v-else -->
  <!-- leadData?.botUser?.name ??  -->
  <Page :title="callLogs?.callerName ?? 'No Name'" :bread-crumbs="[]" :disable-back-button="!user" :disable-elevation="true">
    <div class="items-top gap-[25px flex items-center justify-center px-3">
      <div class="items-top xs:grid-cols-2 flex grid w-full grid-cols-1 gap-[25px] lg:grid-cols-2">
        <div class="justify-aro und flex w-full gap-8 sm:w-full md:w-[70%] lg:w-[90%] xl:w-[90%]">
          <UiTabs default-value="Client" class="w-full self-start">
            <UiTabsList class="grid w-full grid-cols-1">
              <UiTabsTrigger value="Client"> Client Info </UiTabsTrigger>
              <!-- <UiTabsTrigger value="Campaign"> Campaign info</UiTabsTrigger> -->
            </UiTabsList>
            <UiTooltipProvider>
              <UiTabsContent value="Client">
                <!-- {{formattedCallData}} || asfa -->
                <div class="flex grid grid-cols-2 flex-col items-center gap-2 pl-4 capitalize">
                  <div v-for="(value, key) in formattedCallData" :key="key">
                    <!-- <div v-if="Array.isArray(value) && value.length === 2"> -->
                      <UiTooltip>
                        <UiTooltipTrigger as-child>
                          <div class="gap-2 pl-4 capitalize max-w-full">
                            <div class="text-gray-500 font-medium cursor-pointer">{{ key }}</div>
                            <div :class="['font-medium cursor-pointer', (key === 'Session ID') ? 'truncate w-45' : '']">{{ value }}
                            </div>
                          </div>
                        </UiTooltipTrigger>
                        <UiTooltipContent class="w-auto">
                          <p>{{ value }}</p>
                        </UiTooltipContent>
                      </UiTooltip>
                    <!-- </div> -->
                    </div>
                  </div>
                  <div class="flex justify-center mt-4">
                    <div class="w-[100%] relative">
                      <div v-if="isAudioLoading"
                        class="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
                        <Icon name="svg-spinners:90-ring-with-bg" class="h-6 w-6 animate-spin text-white" />
                      </div>
                      <div class="flex justify-center">
                        <audio controls :src="`${config.public.voiceBotBaseUrl}/callRecording?sid=${callLogs?.callSid}`"
                          @loadeddata="onAudioLoaded" @waiting="onAudioLoading" @error="onAudioError" ref="audioPlayer">
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </div>
                  </div>
              </UiTabsContent>
            </UiTooltipProvider>
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
import { useRoute, useRouter } from "vue-router";
import { useBreadcrumbStore } from "~/store/breadcrumbs";

definePageMeta({
  middleware: "admin-only",
});

const { user, refreshUser }: { user: any; refreshUser: any } =
  await useUser();
const route = useRoute("analytics-call-logs-id");
const router = useRouter();
const audioSrc = ref()
const audioElement: any = ref(null)
const isAudioLoading = ref(true)
const config = useRuntimeConfig()
const breadcrumbStore = useBreadcrumbStore();

const isBackRouteMatches = computed(() => {
  const backRoute = router.options.history.state.back; // Assuming `router` is available
  return backRoute && backRoute.startsWith('/contacts-management/campaigns');
});
const query = isBackRouteMatches.value ? "?callSid=true" : "";
const { status, data: callLogs } = await useLazyFetch(
  () => `/api/call-logs/${route.params.id}${query}`,
  {
    server: false,
    headers: {
      "time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  },
);

breadcrumbStore.setBreadcrumbs([
  {
    label: "Call", // Dynamic name
    to: `/analytics/call-logs`,
  },
  {
    label: callLogs.value?.callerName ?? 'No Name',
    to: `/analytics/call-logs/${route.params?.id}`,
  },
])
const isDataLoading = computed(() => status.value === "pending");
watch(() => isDataLoading.value,(newValue) => {
  if (!newValue) {
    if ((!callLogs.value || callLogs.value === null) || callLogs.value === undefined) {
      navigateTo({
        name: 'contacts-management-campaigns', // Replace with your desired route name
      });
      toast.error("No call logs found for this");
    }
  }
})

// const breadCrum = computed(() => {
//   if (user.value) {
//     return [
//       {
//         label: `${callLogs.value?.callerName ?? 'No Name'}`,
//         to: `/analytics/call-logs`,
//       },
//       {
//         label: 'Call Logs',
//         to: `/analytics/call-logs/${callLogs.value?.id}`,
//       },
//     ]

//   } else {
//     []
//   }
// })

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

onMounted(() => {
  audioElement.value = document.querySelector('audio')
});
const onAudioLoaded = () => {
  isAudioLoading.value = false
}
const onAudioLoading = () => {
  isAudioLoading.value = true
}
const onAudioError = () => {
  isAudioLoading.value = false
  if (callLogs.value.length) toast.error("No recording found")
}
</script>
