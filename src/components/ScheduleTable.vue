<template lang="pug">
  .schedule
    .table
      .template(v-for="classItem in classes")
        ScheduleRow(:key="classItem.key" :item="classItem")



</template>

<script setup>

import {ref} from "vue";

const props = defineProps(["classes"]);

</script>

<style scoped>

</style>