<template>
  <div class="px-4 py-2">
    <div class="mb-4 flex items-center justify-between">
      <div v-if="props.title" class="flex items-center gap-4">
        <UiButton
          v-if="!props.disableBackButton"
          variant="outline"
          size="icon"
          @click="handleBackButtonClick"
        >
          <ChevronLeft className="h-4 w-4" />
        </UiButton>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {{ title }}
        </h3>
      </div>
      <!-- <template v-for="(comp, index) in actionButtons" :key="index" :is="comp">
        {{ comp() }}
      </template> -->
      <slot name="actionButtons"></slot>

      <!-- {{ actionButtons() }} -->
    </div>
    <LazyUiSelectSeparator v-if="!props.disableSelector" class="" />
    <div
      :class="[
        props.disableElevation ? '' : 'mt-4 rounded-md bg-white p-6 shadow-md',
      ]"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ChevronLeft } from "lucide-vue-next";

  const props = withDefaults(
    defineProps<{
      title: string;
      wrapInPage: boolean;
      disableElevation?: boolean;
      disablePadding?: boolean;
      disableBackButton?: boolean;
      titleSize?: string;
      actionRows?: any;
      actionButtons?: any;
      subtitle?: string;
      customBackRouter?: string;
      disableSelector?: boolean;
    }>(),
    {
      wrapInPage: true,
      actionButtons: [],
      actionRows: [],
      subTitle: "",
      disableElevation: false,
      disablePadding: false,
      disableBackButton: false,
      titleSize: "medium",
      disableSelector: false,
    },
  );
  const router = useRouter();
  const handleBackButtonClick = () => {
    if (props.customBackRouter) {
      navigateTo(props.customBackRouter);
    } else {
      router.back();
    }
  };
</script>
