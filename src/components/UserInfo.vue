<script setup lang="ts">
import { vueNucleon, watchVueNucleon } from '@alaq/vue'
import { statsAtom } from '../store/AtomicModelStats.ts'
import { userAtom } from '../store/AtomicModelUser.ts'

const timeTabs = {
  week: 'неделя',
  month: 'меясяц',
  quarter: 'квартал',
}

const eventTabs = {
  reg: 'регистрации',
  cancel: 'отмены'
}

const selectedTime = watchVueNucleon(userAtom.core.selectedTime)
const selectedEvent = watchVueNucleon(userAtom.core.selectedEvent)
const info = vueNucleon(userAtom.core.currentInfo)
const data = vueNucleon(userAtom.core.currentData)
</script>

<template lang="pug">
  .user-info(v-if="info?.user_data")
    .name
      span.name {{info.user_data.first_name}}
      span.username {{info.user_data.username}}
      span.name {{info.user_data.second_name}}
    pre регистраций: {{info.reg_count}}
    pre отмен: {{info.cancel_count}}
    pre крайняя активность: {{info.last_event_date}}
    pre последнее сообщение: {{info.last_message}}
    Tabs(v-model="selectedTime", :options="timeTabs")
    Tabs(v-model="selectedEvent", :options="eventTabs")

    //pre {{data}}
    .scheduleDay(v-if="data")
      .scheduleItem(v-for="d in data")

        .title
          .time {{ d.date }}
        ol.peopleList
          li.person(
            v-for="e in d.events"
          )

            span {{e.time}} - {{e.title}}

            //a(:href="person.url") {{ person.pos }}
        //    span -
        //    a(:href="person.url") {{ person.label }}
        //    span.cancel-mark(v-if="person.isCancel")  → отменена
      //pre {{currentDay.mistakes}}
</template>

<style scoped>
.user-info {
  .name {
    padding: var(--fh-5) var(--fw-1);

    span {
      padding: var(--fw-1);
    }
  }
}
</style>