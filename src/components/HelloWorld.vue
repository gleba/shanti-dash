<script setup lang="ts">
import {ref} from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template lang="pug">
  h1 {{ msg }}

  .card
    button(type="button" @click="count++") count ixxs {{ count }}

  p.read-the-docs Click on the Vite and Vue logos to learn more
</template>

<style scoped lang="scss">
.read-the-docs {
  color: #888;
}
</style>
