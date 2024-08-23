<script lang="ts" setup>
  import { NuxtLink } from "#components";
  import { Primitive, type PrimitiveProps } from "radix-vue";
  import type { HTMLAttributes } from "vue";

  const props = withDefaults(
    defineProps<PrimitiveProps & { class?: HTMLAttributes["class"] }>(),
    {
      as: "a",
    },
  );
</script>

<template>
  <Primitive
    :as="NuxtLink"
    class="text-md"
    :as-child="asChild"
    :class="cn('transition-colors hover:text-foreground', props.class)"
  >
    <slot />
  </Primitive>
</template>
