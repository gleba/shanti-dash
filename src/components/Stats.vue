<script setup lang="ts">
import Tabs from './Tabs.vue'
import { vueNucleon, watchVueNucleon } from '@alaq/vue'
import { statsAtom } from '../store/AtomicModelStats.ts'
import { userAtom } from '../store/AtomicModelUser.ts'
import { systemAtom } from '../store/AtomicModelSystem.ts'

const timeTabs = {
  week: 'неделя',
  month: 'меясяц',
  quarter: 'квартал',
}

const eventTabs = {
  reg: 'регистрации',
  cancel: 'отмены',
  none: 'шум',
}

const selectedTime = watchVueNucleon(statsAtom.core.selectedTime)
const selectedEvent = watchVueNucleon(statsAtom.core.selectedEvent)
const data = vueNucleon(statsAtom.core.currentData)

function select(id: number) {
  console.log(id)
  userAtom.core.selectedId(id)
  systemAtom.core.selectedTab("user")
}
</script>

<template lang="pug">
  .stats
    pre интервал
    Tabs(v-model="selectedTime", :options="timeTabs")

    pre событие
    Tabs(v-model="selectedEvent", :options="eventTabs")
    ol.tops
      li.top(v-for="i in data")
        .label
          .count {{i.event_count}}
          a.name(@click="select(i.user_data.id)") {{i.user_data.last_name}} {{i.user_data.first_name}}
</template>

<style scoped>
.stats {
  padding: var(--fh-5) 0 var(--fw-1);

  .tops {
    padding: var(--fh-4) ;
    padding-left: var(--fw-7);

    .top {
      padding: var(--fh-3) var(--fw-3);
      color: var(--color-text-light);
      background-color: var(--color-background-gradient3);
      margin-bottom: var(--fh-1);
      .label {
        display: flex;
        .count {
          padding-right: var(--fw-4);
          font-weight: 800;
        }
        .name {
          font-size: var(--text-size-8);
          cursor: pointer;
        }
      }

    }
  }
}
</style>
