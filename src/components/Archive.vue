<script setup lang="ts">
import {historyMock, peopleMock} from "../store/historyMock.ts";
import HistoryDatePicker from './HistoryDatePicker.vue'

historyMock
peopleMock

</script>

<template lang="pug">
      HistoryDatePicker
      .scheduleDay
        .scheduleItem(v-for="(day, index) in historyMock.schH" :key="index")
          .title
            .time {{ day.time }}
            .name {{ day.name }}
          ol.peopleList
            li.person(
              v-for="(person, pIndex) in day.people",
              :key="pIndex",
              :class="{ 'canceled': person.isCancel }"
            ) {{ peopleMock[person.id].name }} ({{ peopleMock[person.id].username }})
                span.cancel-mark(v-if="person.isCancel")  → отменена

</template>

<style scoped>

</style>