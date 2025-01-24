<template lang="pug">
  .app
    .phone-emulation
      Title
      ScheduleTable(:classes="classes")

</template>

<script setup>
import {ref} from "vue";

const classes = ref([
  {id: 1, name: 'Йога', time: '10:00', participants: 5},
  {id: 2, name: 'Пилатес', time: '12:00', participants: 3},
  {id: 3, name: 'Танцы', time: '14:00', participants: 8},
])
</script>

<style>
/* Стили уже в style.css, поэтому здесь ничего не нужно */
</style>
