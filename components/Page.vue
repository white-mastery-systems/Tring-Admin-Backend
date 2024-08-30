<template>
  <div :class="[
      props.disablePadding
        ? ''
        : 'px-3 pb-2 sm:px-3 md:px-4 md:pt-12 lg:px-4 lg:pt-4 xl:px-4',
    ]" class="w-full py-2" v-if="breadCrumbs?.length > 0">
    <UiBreadcrumb>
      <UiBreadcrumbList>
        <UiBreadcrumbItem v-for="({ label, to }, index) in breadCrumbs" :key="index"
          :class="index === breadCrumbs.length - 1 ? 'text-blue-600' : ''">
          <UiBreadcrumbLink :href="to">{{ label }}</UiBreadcrumbLink>

          <UiBreadcrumbSeparator v-if="index < breadCrumbs.length - 1" />
        </UiBreadcrumbItem>
      </UiBreadcrumbList>
    </UiBreadcrumb>
  </div>
  <div :class="[
      props.disablePadding
        ? ''
        : 'px-2 pb-2 sm:px-2 md:px-4 md:pt-12 lg:px-4 lg:pt-4 xl:px-4',
    ]">
    <div class="mb-2 flex items-center justify-between gap-2">

      <div v-if="props.title"
        :class="['flex gap-4 px-0', (!props.disableBackButton) ? 'items-center' : 'items-start']">
        <UiButton v-if="!props.disableBackButton" variant="outline" size="icon" @click="handleBackButtonClick">
          <ChevronLeft className="h-4 w-4" />
        </UiButton>
        <div v-else class="block sm:block md:block lg:hidden xl:hidden">
          <navigationSheet />
        </div>
        <div>
          <h3 className=" text-2xl font-semibold tracking-tight">
            {{ title }}
          </h3>
          <h4 v-if="props.subTitle" className="text-[12px]">
            {{ props?.subTitle }}
          </h4>
        </div>
      </div>

      <slot name="actionButtons"></slot>
    </div>

    <LazyUiSelectSeparator v-if="!props.disableSelector" class="mb-4" />

    <div :class="[
        props.disableElevation
          ? ''
          : 'shadow-3xl mt-4 overflow-scroll rounded-md bg-white p-1 sm:p-1 md:p-6 lg:p-6 xl:p-6',
      ]">
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
      breadCrumbs?: any;
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
      breadCrumbs: [],
      
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
