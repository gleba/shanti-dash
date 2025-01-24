<template lang="pug">
  section.schedule
    .table
      .row(v-for="classItem in classes" :key="classItem.id")
        .naz
          div {{ classItem.time }}
          div {{ classItem.name }}
        .heh
          div {{ classItem.participants }}
          div Всего: 5
</template>

<script setup>
import statistics from "./statistics.vue";
const props = defineProps(["classes"]);
</script>

<style scoped>

</style>