<template>
  <div class="px-0 py-2 sm:px-0 md:px-4 lg:px-4 xl:px-4">
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
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {{ title }}
          </h3>
          <h4 v-if="props.subTitle" className="text-[12px]">
            {{ props?.subTitle }}
          </h4>
        </div>
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
        props.disableElevation
          ? ''
          : 'mt-4 overflow-scroll rounded-md bg-white p-1 shadow-md sm:p-1 md:p-6 lg:p-6 xl:p-6',
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
      subTitle?: string;
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
