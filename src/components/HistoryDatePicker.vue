<script setup lang="ts">
import { ref } from 'vue'

const historyDatePicker = ref()
</script>

<template lang="pug">
  .date-picker
    input(v-model="historyDatePicker" type="date" id="history-date-picker")
    label( for="history-date-picker" ) {{historyDatePicker || 'Выберите дату'}}
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