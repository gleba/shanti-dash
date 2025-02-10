<script setup lang="ts">

</script>

<template lang="pug">
.svg-item
  svg(width="800" height="600" xmlns="http://www.w3.org/2000/svg")
    path.heart(d="m319.02079,233.21712c42.26026,-115.17683 207.83732,0 0,148.08449c-207.83732,-148.08449 -42.26026,-263.26132 0,-148.08449z")
</template>

<style>
.svg-item {
  pointer-events: none;
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
}
.heart {
  fill: var(--color-text);
  opacity: .1;
  animation: customAni 3900ms ease 0s infinite normal none;
}
@keyframes customAni {
  0%,
  50%,
  100% {
    opacity: .1;
  }

  25%,
  75% {
    opacity: 0;
  }
}
</style>