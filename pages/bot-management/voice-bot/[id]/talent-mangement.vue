<template>
  <Page title="Talent Management">
    <!-- <button type="button">upload file</button> -->
    <div @click="open()" ref="dropZoneRef"
      class="grid min-h-[400px] w-full min-w-[100%] items-center rounded-md border-2 border-dashed border-gray-400 bg-gray-200 text-center font-bold">
      Drop file here
    </div>
    <span class="text-sm text-gray-500">{{ fileName }}</span>
    <br />
    <span class="text-sm text-gray-400">Supported formats JSON/YAML</span>
  </Page>
</template>
<script setup lang="ts">
const route = useRoute("bot-management-voice-bot-id-talent-mangement");
const fileName = ref("")
import { useDropZone, useFileDialog } from "@vueuse/core";
const { data: botData, status: botLoadingStatus } = await useLazyFetch<{ talentConfig?: { name?: string } }>(
  `/api/voicebots/${route.params.id}`,
);
const botDetails: any = ref(await getVoiceBotDetails(route.params.id));

// useHead({
//   title: `Voice Bot | Talent Management`,
// });
watchEffect(() => {
  if (botDetails.value) {
    const userName = botDetails.value?.name ?? 'Unknown Bot Name';
    useHead({
      title: `Voice Bot | ${userName} - Talent Management`,
    });
  }
});
watch(botData, (newBotData) => {
  if (newBotData?.value && newBotData.value?.talentConfig) {
    fileName.value = newBotData.value?.talentConfig?.name ?? ""

  }
})


const { files, open, reset, onChange } = useFileDialog({
  accept:
    "application/yaml,application/json,application/yml,application/octet-stream",
});

onChange(async (files) => {
  if (new Array(files)?.length > 0 && files !== null) {
    fileName.value = files[0].name
    const formData = new FormData();
    formData.append("files", files[0]);
    const uploads = await $fetch(`/api/uploads`, {
      method: "POST",
      body: formData,
    });
    await $fetch(`/api/voicebots/${route.params.id}`, {
      method: "PUT",
      body: {
        talentConfig: {
          ...uploads[0],
        },
      },
    });
    toast.success("Talent uploaded successfully")
  }
});

//   onCancel(() => {
//     /** do something on cancel */
//   });

const dropZoneRef = ref<HTMLDivElement>();

function onDrop(files: File[] | null) {
  console.log({ files });
  // called when files are dropped on zone
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  // specify the types of data to be received.
  dataTypes: ["json", "yaml", "yml", "octet-stream"],
});
</script>
