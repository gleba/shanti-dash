<script setup lang="ts">
import { ref } from 'vue'
import { vueNucleon, watchVueNucleon } from '@alaq/vue'
import { historyAtom } from '../store/AtomicModelHistory.ts'

const selectedDay = watchVueNucleon(historyAtom.core.selectedDay)
const list = vueNucleon(historyAtom.core.list)
</script>

<template lang="pug">
  .date-picker
    input(v-model="selectedDay" type="date" id="history-date-picker")
    label( for="history-date-picker" ) {{selectedDay || 'Выберите дату'}}
  pre доступный период {{list[0]}} - {{list[1]}}
</template>

<style scoped>
.date-picker {
  font-size: var(--text-size-8);
  padding: var(--fh-5) 0 var(--fw-1);
  color: var(--color-text-light);
  label {
    padding: 0 var(--fw-3);
  }
}
</style>