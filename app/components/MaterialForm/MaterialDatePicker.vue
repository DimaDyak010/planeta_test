<template>
  <button
    ref="dateButton"
    class="material-date-picker__button"
    type="button"
    aria-label="Дата и время создания"
    :popovertarget="popoverId"
    :style="{ '--date-anchor': anchor }"
  >
    <AppIcon name="calendar" />
  </button>
  <label :id="popoverId" class="material-date-picker__popover" popover="auto" :style="{ '--date-anchor': anchor }">
    Дата и время создания
    <input ref="dateInput" v-model="datetime" type="datetime-local">
  </label>
</template>

<script setup lang="ts">
import AppIcon from '~/components/ui/AppIcon.vue'

const datetime = defineModel<string>({ required: true })
const popoverId = useId()
const anchor = `--${popoverId}`
const dateButton = useTemplateRef('dateButton')
const dateInput = useTemplateRef('dateInput')

function openAndFocus() {
  if (!dateInput.value?.closest(':popover-open')) {
    dateButton.value?.focus()
    dateButton.value?.click()
  }
  dateInput.value?.focus()
}

defineExpose({ openAndFocus })
</script>

<style scoped lang="less">
.material-date-picker {
  &__button {
    --icon-height: 20px;

    anchor-name: var(--date-anchor);
    display: grid;
    width: 32px;
    height: 32px;
    padding: 0;
    place-items: center;
    border: 0;
    border-radius: 8px;
    background: var(--color-bg);
    color: var(--color-icon-editor);

    &:focus-visible {
      outline: none;
    }

    &:active, &:has(+ .material-date-picker__popover:popover-open) {
      background: var(--color-action-hover);
    }
  }

  &__popover {
    position: fixed;
    inset: auto var(--space-16) var(--space-16);
    display: none;
    gap: var(--space-8);
    width: max-content;
    max-width: calc(100vw - 80px);
    margin: 0 auto;
    padding: var(--space-12);
    border: 0;
    border-radius: var(--radius-12);
    background: var(--color-surface);
    box-shadow: 0 3px 18px rgb(20 20 42 / 15%);
    color: var(--color-secondary);
    font-size: 16px;

    &:popover-open {
      display: grid;
    }

    @supports (bottom: anchor(top)) {
      position-anchor: var(--date-anchor);
      inset: auto;
      bottom: calc(anchor(top) + var(--space-8));
      left: anchor(left);
      margin: 0;
      position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;
    }

    input {
      max-width: 100%;
      padding: 4px 8px;
      border: 1px solid var(--color-muted);
      border-radius: 8px;
      color: var(--color-text);

      &:focus-visible {
        outline: none;
      }
    }
  }
}

@media (hover: hover) {
  .material-date-picker__button:hover {
    background: var(--color-action-hover);
  }
}
</style>
