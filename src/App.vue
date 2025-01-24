<template lang="pug">
  Header
  main
  ScheduleTable( :classes="classes")
</template>

<script>
import Header from './components/Header.vue';
import ScheduleTable from './components/ScheduleTable.vue';
import Statistics from './components/Statistics.vue';
import AddClassForm from './components/AddClassForm.vue';

export default {
  components: {
    Header,
    ScheduleTable,
    Statistics,
    AddClassForm,
  },
  data() {
    return {
      classes: [
        { id: 1, name: 'Йога', time: '10:00', participants: 5 },
        { id: 2, name: 'Пилатес', time: '12:00', participants: 3 },
        { id: 3, name: 'Танцы', time: '14:00', participants: 8 },
      ],
      statistics: {
        totalParticipants: 16,
        mostPopularClass: 'Танцы',
      },
    };
  },
  methods: {
    addClass(newClass) {
      this.classes.push({ ...newClass, id: Date.now() });
      this.updateStatistics();
    },
    updateStatistics() {
      this.statistics.totalParticipants = this.classes.reduce(
          (sum, classItem) => sum + classItem.participants,
          0
      );
      this.statistics.mostPopularClass = this.classes.reduce(
          (mostPopular, classItem) =>
              classItem.participants > mostPopular.participants ? classItem : mostPopular,
          { participants: 0 }
      ).name;
    },
  },
};
</script>

<style>
/* Стили уже в style.css, поэтому здесь ничего не нужно */
</style>
