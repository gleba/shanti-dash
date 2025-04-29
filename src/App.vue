<template lang="pug">
  .app
    .phone-emulation
      Title
      Tabs(
        v-model="system.selectedTab"
        :options="system.tabs"
      )
      //pre {{scheduleStore.selected}}
      template(v-if="system.selectedTab=='current'")
        ScheduleTable(:classes="schedule.events")
      template(v-else-if="system.selectedTab=='archive'")
        Archive
      template(v-else-if="system.selectedTab=='stats'")
        Stats
      template(v-else-if="system.selectedTab=='user'")
        UserInfo

</template>

<script setup lang="ts">
import vueAtom, { watchVueAtom } from '@alaq/vue'
import { scheduleAtom } from './store'
import { systemAtom } from './store/AtomicModelSystem.ts'
import Stats from './components/Stats.vue'
import Tabs from './components/Tabs.vue'
import UserInfo from './components/UserInfo.vue'

const schedule = watchVueAtom(scheduleAtom)
const system = watchVueAtom(systemAtom)
</script>
