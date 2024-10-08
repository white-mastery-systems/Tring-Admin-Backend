<template>
  <div
    class="field_shadow w-full overflow-hidden rounded-lg"
    style="height: 50vh"
  >
    <div
      class="'flex ', h-[50px] w-full items-center justify-between px-2.5 font-medium text-[#ffffff]"
      style="background: #128c7e"
    >
      <div
        class="flex items-center gap-2"
        style="position: relative; top: 14px"
      >
        <!-- {{ leadData?.channel}} -->
        <WhatsappIcon class="align-middle"></WhatsappIcon>

        <span class="text-[14px] capitalize">preview</span>
      </div>
    </div>
    <div
      class="h-[calc(100%-70px)] overflow-y-scroll bg-[#e5ddd5]"
      style="background-image: url(../../whatsapp.png)"
    >
      <div class="h-[calc(100%-70px)] max-w-[70%]">
        <div
          class="field_shadow mx-2 mt-2.5 flex min-h-[40px] flex-col gap-2 rounded-r-xl rounded-bl-xl bg-[#ffffff] p-5"
        >
          <div v-if="templateStore?.values?.header === 'image'">
            <img
              v-if="templateStore?.values?.headerFile?.url"
              :src="templateStore?.values?.headerFile?.url"
              alt=""
            />
          </div>
          <div v-else-if="templateStore?.values?.header === 'video'">
            <video
              v-if="templateStore?.values?.headerFile?.url"
              :src="templateStore?.values?.headerFile?.url"
              controls
              width="100%"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div
            v-else-if="templateStore?.values?.header === 'document'"
            class="flex min-h-[10vh] min-w-[10vw] items-center justify-center bg-gray-100"
          >
            <div
              class="shadow-md flex h-[30px] w-64 items-center justify-center rounded-lg p-2"
            >
              <ScrollText
                v-if="templateStore?.values?.headerFile?.url"
                class="h-10 w-10 text-gray-500"
              ></ScrollText>
              <StickyNote v-else class="h-10 w-10 text-gray-500" />
              <!-- Adjust size if needed -->
            </div>
          </div>
          <div
            v-else-if="templateStore?.values?.header === 'Location'"
           
          >
          <div  class="flex min-h-[10vh] min-w-[10vw] items-center justify-center bg-gray-100">
            <div
              class="shadow-md flex h-[30px] w-64 items-center justify-center rounded-lg p-2"
            >

              <MapPin  class="h-10 w-10 text-gray-500" />
              <!-- Adjust size if needed -->
            </div>
          </div>

          <div class="bg-slate-50 min-h-[5vh] grid grid-cols-1 gap-2">
               <span class="text-lg">{{ '{'+'{'+'Location name'+'}'+'}' }}</span>
               <span class="text-sm">{{ '{'+'{'+'Address'+'}'+'}' }}</span>
          </div>

          </div>
                      <div v-if="templateStore?.values?.header === 'text'">
                {{ templateStore?.values?.headerText }}
              </div>
          <div class="flex flex-col">
            <div class="flex flex-wrap items-center gap-2 ">
              <div v-if="templateStore?.values?.body" class="flex items-center max-w-[250px] overflow-scroll ">
                {{ templateStore?.values?.body }}
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex flex-wrap items-center gap-2 ">
              <div v-if="templateStore?.values?.footer" class="flex items-center">
                {{ templateStore?.values?.footer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useTemplateStore } from "~/store/whatsAppTemplateStore";
  import { StickyNote, ScrollText,MapPin } from "lucide-vue-next";

  const templateStore = useTemplateStore();
</script>
