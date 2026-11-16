<template>
  <button
    class="material-format-menu__toggle"
    type="button"
    aria-label="Формат текста"
    :popovertarget="formatsId"
    :style="{ '--formats-anchor': anchor }"
  >
    <AppIcon name="plus" />
  </button>

  <div
    :id="formatsId"
    ref="formatsPopover"
    class="material-format-menu__formats"
    :style="{ '--formats-anchor': anchor }"
    popover="auto"
    role="group"
    aria-label="Формат абзаца"
  >
    <button type="button" @click="applyFormat('paragraph')">Абзац</button>
    <button
      v-for="level in headings"
      :key="level"
      type="button"
      @click="applyFormat(level)"
    >
      Заголовок {{ level }}
    </button>
    <button type="button" @click="applyFormat('blockquote')">Цитата</button>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '~/components/ui/AppIcon.vue'

type HeadingLevel = 2 | 3
type Format = 'paragraph' | 'blockquote' | HeadingLevel

defineProps<{ headings: readonly HeadingLevel[] }>()
const emit = defineEmits<{
  (event: 'format', format: Format): void
}>()

const formatsId = useId()
const anchor = `--${formatsId}`
const formatsPopover = useTemplateRef('formatsPopover')

function applyFormat(format: Format) {
  formatsPopover.value?.hidePopover()
  emit('format', format)
}
</script>

<style scoped lang="less">
.material-format-menu {
  &__toggle:focus-visible,
  &__formats button:focus-visible {
    outline: none;
  }

  &__toggle {
    --icon-height: 20px;

    anchor-name: var(--formats-anchor);
    display: grid;
    width: 32px;
    height: 32px;
    padding: 0;
    place-items: center;
    border: 0;
    border-radius: 8px;
    background: var(--color-bg);
    color: var(--color-icon-editor);

    &:active {
      background: var(--color-action-hover);
    }
  }

  &__formats {
    position: fixed;
    inset: auto var(--space-16) var(--space-16);
    display: none;
    width: max-content;
    max-width: calc(100vw - 2 * var(--space-16));
    margin: 0 auto;
    padding: var(--space-8);
    border: 0;
    border-radius: 8px;
    background: var(--color-surface);
    box-shadow: 0 3px 18px rgb(20 20 42 / 15%);

    &:popover-open {
      display: grid;
    }

    @supports (top: anchor(bottom)) {
      position-anchor: var(--formats-anchor);
      inset: auto;
      top: calc(anchor(bottom) + var(--space-8));
      left: anchor(left);
      margin: 0;
      position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;
    }

    button {
      padding: 4px var(--space-12);
      border: 0;
      border-radius: 4px;
      background: transparent;
      text-align: start;
      &:active {
        background: var(--color-bg);
      }
    }
  }
}

@media (hover: hover) {
  .material-format-menu__toggle:hover {
    background: var(--color-action-hover);
  }

  .material-format-menu__formats button:hover {
    background: var(--color-bg);
  }
}
</style>
