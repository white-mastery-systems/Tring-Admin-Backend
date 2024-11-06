<template>
  <UiSelect v-model="bot" class="border-l border-r border-transparent rounded-t-none">
    <UiSelectTrigger class="w-[110px] sm:w-[110px] md:w-[250px] lg:w-[250px] xl:w-[250px]">
      <UiSelectValue placeholder="Select a Bot" />
    </UiSelectTrigger>
    <UiSelectContent>
      <template v-if="status === 'pending'">
        <UiSelectItem value="loading">
          <Icon name="svg-spinners:90-ring-with-bg" />
        </UiSelectItem>
      </template>
      <template v-else>
        <UiSelectItem v-for="bot in bots" :key="bot.id" :value="bot.id">
          {{ bot.name }}
        </UiSelectItem>
      </template>
    </UiSelectContent>
  </UiSelect>
</template>
<script setup lang="ts">
const emit = defineEmits(["emailEditBotDetail"]);

interface Bot {
  id: string;
  name: string;
}
const bot = defineModel<string>({ required: true, default: "" });
watch(bot, (newValues) => {
  emit("emailEditBotDetail", newValues)
});
const { status, data: bots } = await useLazyFetch<Bot[]>("/api/bots", {
  server: false,
  default: () => [],
  transform: (bots) => bots.map((bot) => ({ id: bot.id, name: bot.name })),
});
</script>
