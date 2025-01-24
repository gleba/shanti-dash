<template lang="pug">
  .schedule
    .table
      .row(v-for="classItem in classes" :key="classItem.id" @click="select(classItem)")
        .naz
          .time {{ classItem.time }}
          .name {{ classItem.name }}
        .heh участники: {{ classItem.participants }}
        .ScheduleDetail(v-if="classItem.isOpen")
          pre(@click="select(classItem)") {{classItem}}

</template>

<script setup>
import {ref} from "vue";
import ScheduleDetail from "./ScheduleDetail.vue";

const props = defineProps(["classes"]);

// const selected = ref()

function select(classItem) {
  classItem.isOpen = !classItem.isOpen
  // console.log(classItem);
  // if (classItem.isOpen) {
  //   classItem.isOpen = false
  // } else {
  //   classItem.isOpen = true
  // }
}
</script>

<style scoped>

</style>