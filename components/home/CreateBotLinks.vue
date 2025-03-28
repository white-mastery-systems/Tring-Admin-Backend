<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button as UiButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { botStore } from '~/store/botStore';

const props = withDefaults(
  defineProps<{
    navigavtionList: Array<{ title: string; subtitle: string; url: string }>;
  }>(),
  {
    navigavtionList: () => [],
  }
);

const createNewBots = async (url: any) => {
  if (url === "/voice-bot")  {
    navigateTo(url);
    // const { data: botDetails, status: botLoadingStatus, refresh: integrationRefresh } = await useLazyFetch(`/api/voicebots/${route.params.id}`);
    const getSingleVoiceBotDetails = await $fetch(`/api/voicebots`, {
        method: "POST",
        body: {},
      });
      if (getSingleVoiceBotDetails.id) {
        navigateTo(`voice-bot/create-voice-bot/${getSingleVoiceBotDetails?.id}`);
      }
  } 
  if (url === '/chat-bot/create-bot') {
    try {
     const getSingleBotDetails = await $fetch("/api/bots", {
        method: "POST",
        body: {},
      });
      if (getSingleBotDetails?.id) {
        // ${ getSingleBotDetails.id }
        navigateTo(`chat-bot/create-bot/${getSingleBotDetails?.id}`);
      }
    } catch (error) {
      console.log("error", error);
    }
    // const getBotDetails = await listApiBots();
    // toast.success("Created successfully");
  }
}
</script>
<template>
  <div v-if="props.navigavtionList.length > 0"
    class="flex gap-5 flex-wrap justify-between w-full px-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
    <Card v-for="(item, index) in props.navigavtionList" :key="index"
      class="w-full flex items-center justify-between p-6 bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100">
      <CardHeader class="flex items-center gap-5 p-0">
        <div class="flex items-center gap-5">
          <img class="md:block hidden rounded-lg" v-if="item.type === 'chat'" src="assets/icons/create-chat-bot.png"
            width="80" />
          <img class="md:block hidden rounded-lg" v-if="item.type === 'voice'" src="assets/icons/create-voice-bot.png"
            width="80" />
          <div class="flex flex-col gap-1">
            <CardTitle class="text-left text-[16px] sm:text-[16px] md:text-[20px] text-[#3D3D3D] font-semibold">{{
              item.title }}
            </CardTitle>
            <CardDescription class="text-let text-[8px] sm:text-[8px] md:text-[13px] text-[#71717A]">
              {{ item.subtitle }}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardFooter class="flex items-cnter p-0">
        <!-- <NuxtLink :to="item.url"> -->
        <UiButton @click="createNewBots(item.url)"
          class="text-[12px] sm:text-[12px] md:text-[14px] bg-[#FFBC42] px-6 rounded-xl button_shadow">
          Create </UiButton>
        <!-- </NuxtLink> -->
      </CardFooter>
    </Card>
  </div>
</template>
