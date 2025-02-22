<script setup lang="ts">
import {ref} from "vue";

const {item} = defineProps(["item"])
const i = ref(item)
function select() {
  i.value.isOpen = !i.value.isOpen
}

function partSelect() {
  i.value.partIsOpen = !i.value.partIsOpen
}


</script>

<template lang="pug">
  //pre {{i}}ккккrr
  .row()
    .naz(@click="select()")
      .second
        .first
          .time {{ i.time }}
          .instructor {{ i.instructor }}
        .name {{ i.title }}///m
      .count {{ i.participantsCount }}
      .button(v-if="i.isOpen") .
      .button(v-else) ^
    .heh
    .detail(v-if="i.isOpen")
      .description(v-html="i.description")
      .participantsTitle(@click="partSelect()") 而形成发士大夫
        .participantsList(v-if="i.partIsOpen")
          .item {{ i.participantsList }}
      //pre ---
      //.debug {{i.description}}
</template>

<style scoped >
.debug {
  font-family: monospace;
  opacity: .2;
}
.time {
  //text-align: center;
}
.end {
  opacity: .2;
  font-size: 13px;
}
</style>