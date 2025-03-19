<!-- <template>
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

  interface Bot {
    id: string;
    name: string;
  }
  const bot = ref("all");
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
</script> -->
<template>
  <div>
    <UiSelect v-model="bot">
      <UiSelectTrigger class="w-[110px] sm:w-[110px] md:w-[180px] lg:w-[180px] xl:w-[180px]">
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
const props = defineProps({
  modelValue: {
    type: String,
    default: "all",
  },
});
const emit = defineEmits(["update:modelValue"]);
interface Bot {
  id: string;
  name: string;
}
const bot = ref(props.modelValue);

const { status, data: bots } = await useLazyFetch<Bot[]>("/api/bots", {
  server: false,
  default: () => [],
  transform: (bots) => bots.map((bot) => ({ value: bot.id, content: bot.name })),
});

watchEffect(() => {
  bot.value = props.modelValue;
});

// Watch for changes in bot and emit the updated value to the parent
watch(bot, (newValue) => {
  emit("update:modelValue", newValue);
});

// const findBot = (botId: string) => bots.value.find((bot) => bot.id === botId) as Bot;
</script>
