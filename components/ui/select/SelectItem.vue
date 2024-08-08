<script setup lang="ts">
  import { type HTMLAttributes, computed } from "vue";
  import {
    SelectItem,
    SelectItemIndicator,
    type SelectItemProps,
    SelectItemText,
    useForwardProps,
  } from "radix-vue";

  const props = defineProps<
    SelectItemProps & { class?: HTMLAttributes["class"] }
  >();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectItem
    v-bind="forwardedProps"
    :class="
      cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class,
      )
    "
  >
    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>
