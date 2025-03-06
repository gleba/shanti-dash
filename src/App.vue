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
      //pre {{scheduleStore.data}}
  //Heart
</template>

<script setup lang="ts">
import vueAtom, {watchVueAtom} from "@alaq/vue";
import {scheduleAtom} from "./store";

const scheduleStore = watchVueAtom(scheduleAtom)
</script>
