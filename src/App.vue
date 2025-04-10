<template lang="pug">
  .app
    .phone-emulation
      Title
      Days(
        v-model="scheduleStore.selected"
        :options="scheduleStore.days"
      )
      pre {{scheduleStore.selected}}
      template(v-if="scheduleStore.selected=='current'")

        ScheduleTable(:classes="scheduleStore.events")
      template(v-else)
        Archive

      pre {{scheduleStore.connected ? "connected" :"offline"}}
      pre {{scheduleStore.time}}
      pre(v-if="scheduleStore.errors?.length") errors:{{scheduleStore.errors}}
</template>

<script setup lang="ts">
import vueAtom, {watchVueAtom} from "@alaq/vue";
import {scheduleAtom} from "./store";

const scheduleStore = watchVueAtom(scheduleAtom)
</script>
