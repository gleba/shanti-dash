<template lang="pug">
  .custom-select
    //select.hidden-select(v-model="model")

    .options-wrapper
      .option(
        v-for="(label, value) in options"
        :key="value"
        :class="{ selected: model === value }"
        @click="selectOption(value)"
      ) {{ label }}
        //pre {{label}}
</template>

<script setup lang="ts">

interface Props {
  options: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [

  ]
})

const model = defineModel<string | number>()

const selectOption = (value: string | number): void => {
  model.value = value
}
</script>

<style scoped lang="scss">
.custom-select {
  .hidden-select {
    display: none;
  }

  .options-wrapper {
    display: flex;
    gap: 2px;
  }

  .option {
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: var(--text-size-8);
    background-color: var(--color-background-gradient2);

    &:hover {
      background-color: var(--color-background-hover);
    }

    &.selected {
      background-color: var(--color-background-selected);
      color: var(--color-text);
    }
  }
}
</style>