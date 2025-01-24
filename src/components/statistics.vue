<template>
  <div class="statistics">
    <h2>Статистика</h2>
    <p>Всего участников: {{ statistics.totalParticipants }}</p>
    <p>Самое популярное занятие: {{ statistics.mostPopularClass }}</p>
  </div>
</template>

<script>
export default {
  name: 'Statistics',
  props: {
    statistics: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.statistics {
  background-color: #f9f9f9;
  padding: 20px;
  border: 1px solid #ddd;
}
</style>