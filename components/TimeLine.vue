<script setup lang="ts">

// Props: a single step object and the current index
const emits = defineEmits(["timeLine"]);

defineProps({
  data: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  totalSteps: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
});

</script>

<template>
  <div orientation="vertical" class="mx-auto flex w-full flex-col justify-start gap-10">
    <div class="relative flex w-full items-start gap-6">
      <div
        class="absolute left-[18px] top-[64px] block h-[105%] w-0.5 shrink-0 rounded-full opacity-100 group-data-[state=completed]:bg-[#424BD1]" />
      <div as-child class="rounded-full">
        <div>
          <Circle class="absolute left-[0px] top-[50%] size-5 rounded-full bg-[#424BD1] z-10" />
          <div v-if="!(index === (totalSteps - 1))"
            class="bg-[#8A8A8A] w-[2px] absolute left-[9px] top-[60%] z-0 rounded-xl"
            :class="[(height) ? `h-[${height}px]` : '']">

          </div>
        </div>
      </div>
      <div class="field_shadow flex w-full flex-col gap-1 rounded-lg p-4 pr-6">
        <div class="flex flex-col gap-2">
          
          <div class="grid grid-cols-2 gap-2">
          <h4 class="scroll-m-20 text-[16px] font-semibold tracking-tight">
            {{ data.metadata?.text }}
          </h4>
          
           <h4 class="text-right scroll-m-20 text-[16px] font-semibold tracking-tight">
            Chat {{ data.chatIndex }}
           </h4>
          </div>



          <div class="" v-if="data.metadata?.website">
            <span v-if="data.metadata?.title" class="min-w-[90px] text-[16px] font-semibold">
              {{ data.metadata?.title }}
            </span>
            <div class="flex items-center gap-2">
              <span>
                <LinkIcon />
              </span>
              <!-- @click="emits('timeLine', data.chatId)" -->
              <NuxtLink v-if="data?.metadata?.website" :to="data?.metadata?.website" target="_blank"
                class="text-indigo-600 cursor-pointer">
                {{ data?.metadata?.website }}
              </NuxtLink>

              
            </div>

          </div>
        
          <p class="mt-2 text-[14px] font-normal text-gray-600">

            {{ data.createdAt }}
              <NuxtLink class="text-indigo-600 cursor-pointer px-2 font-semibold"  @click="emits('timeLine', data.chatId)">
                Click To  View
            </NuxtLink>
            <!-- {{ format(new Date(data.createdAt), "dd MMM yyyy hh:mm aa") }} -->
          </p>
        </div>
        <span
          class="sr-only flex flex-col items-start gap-2 text-xs text-muted-foreground transition md:not-sr-only lg:text-sm">
        </span>
      </div>
    </div>
  </div>
</template>
