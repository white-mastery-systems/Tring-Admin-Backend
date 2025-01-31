<template>
    <UiButton @click="increment">{{ count }}</UiButton>
</template>
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
const count = ref(0)
function increment() {
    count.value++
}
</script>