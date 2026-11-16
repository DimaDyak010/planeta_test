<template>
  <div class="rich-text">
    <div class="rich-text__controls">
      <button class="rich-text__toggle" type="button" aria-label="Формат текста"
              :aria-expanded="formatsOpen" @click="formatsOpen = !formatsOpen">
        <AppIcon name="plus" />
      </button>
      <div v-if="formatsOpen" class="rich-text__formats" role="group" aria-label="Формат абзаца"
           @keydown.esc="formatsOpen = false">
        <button type="button" @click="applyFormat('paragraph')">Абзац</button>
        <button v-for="level in headings" :key="level" type="button" @click="applyFormat(level)">
          Заголовок {{ level }}
        </button>
        <button type="button" @click="applyFormat('blockquote')">Цитата</button>
      </div>
    </div>
    <EditorContent :editor="editor" class="rich-text__input" />
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import AppIcon from '~/components/AppIcon.vue'

const headings = [1, 2, 3] as const
const formatsOpen = ref(false)
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: { levels: [...headings] },
      blockquote: {},
    }),
    Placeholder.configure({ placeholder: 'Введите текст…' }),
  ],
  editorProps: {
    attributes: {
      'aria-label': 'Текст материала',
      'aria-multiline': 'true',
      role: 'textbox',
    },
  },
})

function applyFormat(format: 'paragraph' | 'blockquote' | typeof headings[number]) {
  const chain = editor.value?.chain().focus()
  if (!chain) return
  if (format === 'paragraph') chain.setParagraph().run()
  else if (format === 'blockquote') chain.toggleBlockquote().run()
  else chain.toggleHeading({ level: format }).run()
  formatsOpen.value = false
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

  &__controls {
    position: relative;
  }
  &__toggle {
    --icon-height: 20px;

    display: grid;
    width: 32px;
    height: 32px;
    padding: 0;
    place-items: center;
    border: 0;
    border-radius: 8px;
    background: var(--color-bg);
    color: var(--color-icon-editor);

    &:active, &:focus-visible {
      background: var(--color-action-hover);
    }
  }

  &__formats {
    position: absolute;
    z-index: 1;
    top: calc(32px + var(--space-8));
    display: grid;
    width: max-content;
    padding: var(--space-8);
    border-radius: 8px;
    background: var(--color-surface);
    box-shadow: 0 3px 18px rgb(20 20 42 / 15%);

    button {
      padding: 4px var(--space-12);
      border: 0;
      border-radius: 4px;
      background: transparent;
      text-align: start;
      &:active, &:focus-visible {
        background: var(--color-bg);
      }
    }
  }

  &__input {
    :deep(.tiptap) {
      min-height: 180px;
      overflow-wrap: anywhere;
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

  .rich-text__formats button:hover {
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
