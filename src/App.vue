<template lang="pug">
  .app
    .phone-emulation
      Title
      Days(
        v-model="selectedDay"
        :options="optionsDays"
      )
      ScheduleTable(:classes="mockFmt[selectedDay].events")

      pre {{mockData[selectedDay]}}
      pre ----
      pre {{mockFmt[selectedDay]}}
  Heart
</template>

<script setup>
import {ref} from "vue";
import mockData from "./store/mock";
import mockFmt from "./store/mockFmt";
import Heart from "./components/Heart.vue";

const selectedDay = ref(0);
const optionsDays = [
  { value: 0, label: 'Сегодня' },
  { value: 1, label: 'Завтра' },
]


</script>

<style>
/* Стили уже в style.css, поэтому здесь ничего не нужно */
</style>
