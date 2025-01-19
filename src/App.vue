<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import WithChild from "./components/WithChild.vue";
</script>

<template lang="pug">
  HelloWorld(msg="Vite + Vue")

  WithChild
    .plus +
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.plus {
 color: white;
}
</style>
