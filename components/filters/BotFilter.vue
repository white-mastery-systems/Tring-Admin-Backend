<template>
  <div>
    <UiSelect v-model="bot">
      <UiSelectTrigger
        class="w-[110px] sm:w-[110px] md:w-[250px] lg:w-[250px] xl:w-[250px]"
      >
        <UiSelectValue placeholder="Select a Bot" />
      </UiSelectTrigger>
      <UiSelectContent>
        <template v-if="status === 'pending'">
          <UiSelectItem value="loading">
            <Icon name="svg-spinners:90-ring-with-bg" />
          </UiSelectItem>
        </template>
        <template v-else>
          <UiSelectItem value="all">All Bots</UiSelectItem>
          <UiSelectItem v-for="(bot, index) in bots" :key="index" :value="bot.value">
            {{ bot.content }}
          </UiSelectItem>
        </template>
      </UiSelectContent>
    </UiSelect>
  </div>
</template>
<script setup lang="ts">
  const emit = defineEmits(["input"]);

  // interface Bot {
  //   id: string;
  //   name: string;
  // }
const bot = ref("all");
  // const bot = defineModel<string>({ required: true, default: "all" });
  const { status, data: bots } = await useLazyFetch<Bot[]>("/api/bots", {
    server: false,
    default: () => [],
    transform: (bots) => bots.map((bot) => ({ value: bot.id, content: bot.name })),
  });
  const findBot = (botId: string) =>
  bots.value.find((bot) => bot.id === botId) as Bot;
  watch(bot, (newValue) => {
    emit("input", newValue)
  });
</script>
