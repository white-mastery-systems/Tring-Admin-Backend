<script setup lang="ts">

  import { Primitive, type PrimitiveProps } from "radix-vue";
  import type { HTMLAttributes } from "vue";
  import { type ButtonVariants, buttonVariants } from ".";

  interface Props extends /* @vue-ignore */  PrimitiveProps {
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    class?: HTMLAttributes["class"];
    color?: string;
    loading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    as: "button",
    loading: false,
  });
  function styleHandler(type: string | undefined): string {
    if (type === "primary") {
      return "bg-[#424bd1] hover:bg-[#424bd1] text-white hover:text-white hover:brightness-110";
    }
    return "";
  }
const { loading } = toRefs(props);
</script>

<template>
  <Primitive as="button" :as-child="asChild" :class="
      cn(
        buttonVariants({ variant, size }),
        props.class,
        styleHandler(props?.color),
      )
    " :disabled="loading || false">
    <template v-if="loading">
      <Icon name="svg-spinners:90-ring-with-bg"
        class="h-6 w-6 animate-spin"
        :class="(variant === 'outline' ? 'text-gray-500' : 'text-white')"
        />
    </template>
    <slot v-else />
  </Primitive>
</template>
