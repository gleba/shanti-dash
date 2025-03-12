<script setup lang="ts">
import {ref} from "vue";

const {item} = defineProps(["item"])
const i = ref<FrontRowEvent>(item)

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
        .count(v-else) {{i.participantsActiveCount}}/{{ i.participantsCount }}
      OpenIcon(:is-open="i.isOpen").button

    .detailView(v-if="i.isOpen")
      .description(v-html="i.descriptionExplain")
      .description(v-html="i.description")
      .partyAllTogether
        .partyLine(@click="partSelect()")
          .participantsTitle Список участников:
          OpenIcon(:is-open="i.partIsOpen").partyListButton
        .participantsList(v-if="i.partIsOpen")
          .item(v-for="p in i.participantsList")
            span  {{p.pos}} -&nbsp;
            a(:href="p.url" v-if="p.name"  target='_blank') {{p.name}}
            a(v-if="p.username")  @{{p.username}}
          .canceled(v-if="i.participantsCanceled?.length") Отменившие:
            .item(v-for="p in i.participantsCanceled")
              a(:href="p.canceledUrl" target="_blank") {{p.pos}}
              span &nbsp;-&nbsp;
              a(:href="p.url" v-if="p.name"  target='_blank') {{p.name}}

</template>

<style scoped>

</style>