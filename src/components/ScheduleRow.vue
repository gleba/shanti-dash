<script setup lang="ts">
import {ref} from "vue";

const {item} = defineProps(["item"])
const i = ref(item)
function select() {
  i.value.isOpen = !i.value.isOpen
}
</script>

<template lang="pug">
  //pre {{i}}
  .row(@click="select()")
    .naz
      .second
        .first
          .time {{ i.time }}
          .instructor {{ i.instructor }}
        .name {{ i.title }}
      .count {{ i.participantsCount }}
      .button ^
    .heh
    .detail(v-if="i.isOpen")
      .description(v-html="i.description")
      //pre ---
      //.debug {{i.description}}
</template>

<style scoped >
.debug {
  font-family: monospace;
  opacity: .2;
}
</style>