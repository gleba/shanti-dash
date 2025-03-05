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
  //pre {{i}}
  .row()
    .firstView(@click="select()")
      .secondLine
        .firstLine
          .time {{ i.time }}
          .instructor {{ i.instructor }}
        .name {{ i.title }}
      .people
        .peopleIcon
          IIconParkOutlinePeoples
        .infinity(v-if="i.participantsCount==null")
          IBiInfinity
        .count(v-else) {{i.participantsList?.length}}/{{ i.participantsCount }}
      OpenIcon(:is-open="i.isOpen").button
    .detailView(v-if="i.isOpen")
      .description(v-html="i.description")
      .partyAllTogether
        .partyLine(@click="partSelect()")
          .participantsTitle Список участников:
          OpenIcon(:is-open="i.partIsOpen").partyListButton
        .participantsList(v-if="i.partIsOpen")
            .item(v-for="p in i.participantsList")
              a(:href="p.url") {{p.name}}
                span(v-if="p.username")
                  span(v-if="p.name") ,
                  |  @{{p.username}}
                pre(v-else)  - {{p.url}}

</template>

<style scoped >

</style>