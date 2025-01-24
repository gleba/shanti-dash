<template>
  <div class="add-class-form">
    <h2>Добавить занятие</h2>
    <form @submit.prevent="submitForm">
      <label>
        Название:
        <input v-model="newClass.name" type="text" required />
      </label>
      <label>
        Время:
        <input v-model="newClass.time" type="time" required />
      </label>
      <label>
        Участники:
        <input v-model="newClass.participants" type="number" required />
      </label>
      <button type="submit">Добавить</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AddClassForm',
  data() {
    return {
      newClass: {
        name: '',
        time: '',
        participants: 0,
      },
    };
  },
  methods: {
    submitForm() {
      this.$emit('add-class', { ...this.newClass, id: Date.now() });
      this.newClass = { name: '', time: '', participants: 0 };
    },
  },
};
</script>

<style scoped>
.add-class-form {
  margin-top: 20px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>