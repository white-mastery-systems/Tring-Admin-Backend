<template>
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
              <div v-if="false" class="flex grid grid-cols-2 flex-col items-center gap-2 pl-4 capitalize">
                <div v-for="(entry, index) in details" :key="index" class="max-w-full font-medium">
                  <div v-if="Array.isArray(entry) && entry.length === 2">
                    <div class="max-w-[100%] truncate">
                      <div class="text-gray-500">{{ entry[0] }}</div>
                      <div class="w-[90%]">
                        <a v-if="entry[0] === 'Mobile'" :href="`tel:${entry[1]}`" class="truncate text-[#424bd1]">
                          {{ entry[1] }}
                        </a>
                        <a v-else-if="entry[0] === 'Email'" :href="`mailto:${entry[1]}`"
                          class="block truncate lowercase text-[#424bd1]">
                          {{ entry[1] }}
                        </a>
                        <div class="text-indigo-600 cursor-pointer" v-else-if="entry[0] === 'parentUrl'">
                          <NuxtLink :to="entry[1]" target="_blank">Website</NuxtLink>
                        </div>
                        <div v-else class="truncate">
                          {{ entry[1] }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else>Invalid entry</div>
                </div>
              </div>
            </UiTabsContent>
            <UiTabsContent value="Campaign">
            </UiTabsContent>
          </UiTabs>
        </div>
        <div v-if="false"
          class="field_shadow h-screen-minus-11 w-full overflow-hidden rounded-lg bg-[#ffffff] sm:w-full md:w-full lg:w-[100%] xl:w-[100%]">
          <div :class="[
            'flex h-[70px] w-full items-center justify-between px-2.5 font-medium text-[#ffffff]',
          ]" :style="leadData?.channel === 'whatsapp'
                ? 'background:#128C7E'
                : `background:hsl(${leadData?.bot.metadata.ui?.color?.replaceAll(' ', ',')})`
              ">
            <div class="flex items-center gap-2">
              <WhatsappIcon v-if="leadData?.channel === 'whatsapp'" class="align-middle"></WhatsappIcon>

              <span class="text-[14px] capitalize">{{
                leadData?.bot?.name
                }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});
</script>
