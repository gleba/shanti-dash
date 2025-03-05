<template lang="pug">
  .app
    .phone-emulation
      Title
      PWABadge
      Days(
        v-model="scheduleStore.selected"
        :options="scheduleStore.chats"
      )
      ScheduleTable(:classes="scheduleStore.data")

  //Heart
</template>

<script setup lang="ts">
import {useScheduleStore} from "./store";
import PWABadge from "./components/PWABadge.vue";
const scheduleStore = useScheduleStore();
</script>

<style>
/* Стили уже в style.css, поэтому здесь ничего не нужно */
</style>
