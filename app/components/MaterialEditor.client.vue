<template>
  <div class="rich-text">
    <div class="rich-text__controls" :style="{ '--formats-anchor': `--${formatsId}` }">
      <button
        class="rich-text__toggle"
        type="button"
        aria-label="Формат текста"
        :popovertarget="formatsId"
      >
        <AppIcon name="plus" />
      </button>

      <div
        :id="formatsId"
        ref="formatsPopover"
        class="rich-text__formats"
        popover="auto"
        role="group"
        aria-label="Формат абзаца"
      >
        <button type="button" @click="applyFormat('paragraph')">Абзац</button>
        <button
          v-for="level in headings"
          :key="level"
          type="button"
          :disabled="level === 1 && h1Unavailable"
          @click="applyFormat(level)"
        >
          Заголовок {{ level }}
        </button>
        <button type="button" @click="applyFormat('blockquote')">Цитата</button>
      </div>
      <slot name="actions" />
    </div>
    <EditorContent :editor="editor" class="rich-text__input" />
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import AppIcon from '~/components/AppIcon.vue'
import { countH1, SingleHeading } from '~/utils/singleHeading'

const headings = [1, 2, 3] as const
const formatsId = useId()
const formatsPopover = ref<HTMLElement | null>(null)
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: { levels: [...headings] },
      blockquote: {},
    }),
    Placeholder.configure({ placeholder: 'Введите текст…' }),
    SingleHeading,
  ],
  editorProps: {
    attributes: {
      'aria-label': 'Текст материала',
      'aria-multiline': 'true',
      role: 'textbox',
    },
  },
})

const h1Unavailable = computed(() => {
  const instance = editor.value
  return !!instance && countH1(instance.state.doc) > 0 && !instance.isActive('heading', { level: 1 })
})

function applyFormat(format: 'paragraph' | 'blockquote' | typeof headings[number]) {
  const instance = editor.value
  if (!instance) return

  formatsPopover.value?.hidePopover()
  const chain = instance.chain().focus()
  if (format === 'paragraph') chain.setParagraph().run()
  else if (format === 'blockquote') chain.toggleBlockquote().run()
  else chain.toggleHeading({ level: format }).run()
}

defineExpose({
  getContent() {
    const instance = editor.value
    if (!instance || instance.isEmpty) return null
    return { html: instance.getHTML(), json: instance.getJSON() }
  },
})
</script>

<style scoped lang="less">
.rich-text {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: var(--space-24);

  &__toggle:focus-visible,
  &__formats button:focus-visible {
    outline: none;
  }

  &__controls {
    display: flex;
    align-items: flex-start;
    gap: var(--space-8);
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
      &:enabled:active {
        background: var(--color-bg);
      }
      &:disabled {
        opacity: .6;
        cursor: default;
      }
    }
  }

  &__input {
    :deep(.tiptap) {
      min-height: 180px;
      overflow-wrap: anywhere;
    }
    :deep(.tiptap:focus-visible) {
      outline: none;
    }
    :deep(.is-editor-empty:first-child::before) {
      float: left;
      height: 0;
      color: var(--color-muted);
      content: attr(data-placeholder);
      pointer-events: none;
    }
    :deep(blockquote) {
      margin-inline: 0;
      padding-inline-start: 1em;
      border-inline-start: 2px solid var(--color-accent);
    }
  }
}

@media (hover: hover) {
  .rich-text__toggle:hover {
    background: var(--color-action-hover);
  }

  .rich-text__formats button:enabled:hover {
    background: var(--color-bg);
  }
}

@media (max-width: 600px) {
  .rich-text {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
    font-size: 16px;
    &__controls {
      order: 1;
    }
    &__input :deep(.tiptap) {
      min-height: 28px;
    }
  }
}
</style>
