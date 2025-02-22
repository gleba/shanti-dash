<script setup lang="ts">
const props = defineProps(["isOpen"]);
</script>

<template lang="pug">
ISolarAltArrowUpLineDuotone(v-if="isOpen")
ISolarAltArrowDownLineDuotone(v-else)
</template>

<style scoped>

</style>