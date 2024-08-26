<template>
  <Page :title="leadData?.botUser?.name ?? 'testing'" :disable-back-button="false" :disable-elevation="true">
    <!-- sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 -->
    <div class="items-top flex gap-[25px justify-start items-center px-3">
      <!-- mx-8 -->
      <div class="flex w-full justify-around gap-8 sm:w-full md:w-[100%] lg:w-[100%] xl:w-[100%]">
        <UiTabs default-value="Chat" class="w-full self-start">
          <UiTabsList class="grid w-full grid-cols-2 mb-4 w-[40%]">
            <UiTabsTrigger value="Chat"> Chat Log </UiTabsTrigger>
            <UiTabsTrigger value="Timeline"> Timeline</UiTabsTrigger>
          </UiTabsList>

          <UiTabsContent value="Chat">
            <div class="flex flex-col items-center gap-2 pl-4 capitalize w-full">
              <div
                class="field_shadow h-[75vh] w-full overflow-hidden rounded-lg bg-[#ffffff] sm:w-full md:w-full lg:w-[100%] xl:w-[100%]">
                <div :class="[
                  'flex items-center justify-between font-medium w-full h-[70px] text-[#ffffff] px-[20px]',
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
                    <div class="flex flex-col items-end w-full" v-if="messageList.role === 'user'">
                      <span class="text-[14px]" style="color: #8a8a8a">{{
                        leadData?.botUser?.name
                      }}</span>
                      <div
                        class="flex flex-col items-end justify-center rounded-l-xl rounded-br-xl text-[#ffffff] min-w-[80%] p-2.5 text-black mt-2.5">
                        <div>{{ messageList.content }}</div>
                      </div>
                      <div class="text-[12px] opacity-60">
                        {{ formatDate(new Date(messageList.createdAt), "hh:mm a") }}
                      </div>
                    </div>
                    <!-- Assistant Message -->
                    <div class="w-[90%]" v-if="messageList.role === 'assistant'">
                      <span class="text-[14px]" style="color: #8a8a8a">{{
                        leadData?.bot.metadata.prompt.NAME
                      }}</span>
                      <div
                        class="flex flex-col mt-2.5 min-h-[80px] bg-[#ffffff] p-2.5  gap-2 rounded-r-xl rounded-bl-xl shadpw-field">
                        <MdText :content="JSON.parse(messageList.content).response" />
                        <div class="flex flex-col">
                          <div class="flex items-center gap-2">
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
          </UiTabsContent>
          <UiTabsContent value="Timeline">
            <div class="flex justify-center items-center capitalize py-3 px-5">
              <UiStepper orientation="vertical" class="mx-auto flex w-full flex-col justify-start gap-10">
                <UiStepperItem v-for="step in steps" :key="step.step" v-slot="{ state }"
                  class="relative flex w-full items-start gap-6" :step="step.step">
                  <UiStepperSeparator v-if="step.step !== steps[steps.length - 1].step"
                    class="absolute left-[18px] top-[38px] block h-[105%] w-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary" />

                  <UiStepperTrigger as-child>
                    <UiButton :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'" size="icon"
                      class="z-10 rounded-full shrink-0"
                      :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']">
                      <Check v-if="state === 'completed'" class="size-5" />
                      <Circle v-if="state === 'active'" />
                      <Dot v-if="state === 'inactive'" />
                    </UiButton>
                  </UiStepperTrigger>

                  <div class="flex flex-col gap-1">
                    <UiStepperTitle :class="[state === 'active' && 'text-primary']"
                      class="text-sm font-semibold transition lg:text-base">
                      {{ step.title }}
                    </UiStepperTitle>
                    <UiStepperDescription :class="[state === 'active' && 'text-primary']"
                      class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm">
                      {{ step.description }}
                    </UiStepperDescription>
                  </div>
                </UiStepperItem>
              </UiStepper>
            </div>
          </UiTabsContent>
        </UiTabs>
      </div>
    </div>
  </Page>
</template>
<script setup lang="ts">
import { Check, Circle, Dot } from 'lucide-vue-next'

definePageMeta({
  middleware: "admin-only",
});

const route = useRoute("chats-id");

const { status, data: leadData } = await useLazyFetch(
  () => `/api/org/chat/${route.params.id}`,
  {
    server: false,
  },
);

const steps = [
  {
    step: 1,
    title: 'Your details',
    description:
      'Provide your name and email address. We will use this information to create your account',
  },
  {
    step: 2,
    title: 'Company details',
    description: 'A few details about your company will help us personalize your experience',
  },
  {
    step: 3,
    title: 'Invite your team',
    description:
      'Start collaborating with your team by inviting them to join your account. You can skip this step and invite them later',
  },
]
</script>