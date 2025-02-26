<template lang="pug">
  .app
    .phone-emulation
      Title
      Days(
        v-model="selectedDay"
        :options="scheduleStore.chats"
      )
      ScheduleTable(:classes="scheduleStore.data")

      //- pre {{mockData[selectedDay]}}
      //- pre ----
      //- pre {{mockFmt[selectedDay]}}

  //Heart
</template>

<script setup lang="ts">
import {useScheduleStore} from "./store";
const scheduleStore = useScheduleStore();
</script>

<style>
/* Стили уже в style.css, поэтому здесь ничего не нужно */
</style>
