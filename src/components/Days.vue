<template lang="pug">
  .custom-select
    select.hidden-select(v-model="model")
      option(
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      ) {{ option.label }}
    .options-wrapper
      .option(
        v-for="option in options"
        :key="option.value"
        :class="{ selected: model === option.value }"
        @click="selectOption(option.value)"
      ) {{ option.label }}
</template>

<script setup lang="ts">
interface Option {
  value: string | number
  label: string
}

interface Props {
  options: Option[]
}

const props = withDefaults(defineProps<Props>(), {
  options: () => []
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