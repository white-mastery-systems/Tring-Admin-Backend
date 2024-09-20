<script setup lang="ts">

  import { Primitive, type PrimitiveProps } from "radix-vue";
  import type { HTMLAttributes } from "vue";
  import { type ButtonVariants, buttonVariants } from ".";

  interface Props extends /* @vue-ignore */  PrimitiveProps {
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    class?: HTMLAttributes["class"];
    color?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    as: "button",
  });
  function styleHandler(type: string | undefined): string {
    if (type === "primary") {
      return "bg-[#424bd1] hover:bg-[#424bd1] text-white hover:text-white hover:brightness-110";
    }
    return "";
  }
</script>

<template>
  <Primitive
    as="button"
    :as-child="asChild"
    :class="
      cn(
        buttonVariants({ variant, size }),
        props.class,
        styleHandler(props?.color),
      )
    "
  >
    <slot />
  </Primitive>
</template>
