<script setup lang="ts">
import { historyMock, peopleMock } from '../store/historyMock.ts'
import HistoryDatePicker from './HistoryDatePicker.vue'
import { vueNucleon } from '@alaq/vue'
import { historyAtom } from '../store/AtomicModelHistory.ts'
const currentDay = vueNucleon(historyAtom.core.currentData)
</script>

<template lang="pug">
  HistoryDatePicker
  h2 {{ currentDay.title }}
  .scheduleDay(v-if="currentDay && currentDay.events")
    .scheduleItem(v-for="(day, index) in currentDay.events" :key="index")
      .title
        .time {{ day.time }}
        .name {{ day.title }}
      ol.peopleList
        li.person(
          v-for="(person, personId) in day.people",
          :key="personId",
          :class="{ 'canceled': person.isCancel }"
        )
          a(:href="person.url") {{ person.pos }}
          span -
          a(:href="person.url") {{ person.label }}
          span.cancel-mark(v-if="person.isCancel")  → отменена
    pre {{currentDay.mistakes}}
</template>

<style scoped>

</style>