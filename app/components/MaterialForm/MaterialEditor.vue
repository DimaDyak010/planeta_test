<template>
  <div class="rich-text">
    <div class="rich-text__controls">
      <MaterialFormatMenu :headings="headings" @format="applyFormat" />
      <MaterialDatePicker ref="datePicker" v-model="datetime" />
    </div>
    <EditorContent :editor="editor" class="rich-text__input" />
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import MaterialDatePicker from './MaterialDatePicker.vue'
import MaterialFormatMenu from './MaterialFormatMenu.vue'

const headings = [2, 3] as const
const emit = defineEmits<{
  (event: 'content-change'): void
}>()
const datetime = defineModel<string>('datetime', { required: true })
const datePicker = useTemplateRef('datePicker')
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
  onUpdate: () => emit('content-change'),
})

function applyFormat(format: 'paragraph' | 'blockquote' | typeof headings[number]) {
  const instance = editor.value
  if (!instance) return

  const chain = instance.chain().focus()
  if (format === 'paragraph') chain.setParagraph().run()
  else if (format === 'blockquote') chain.toggleBlockquote().run()
  else chain.toggleHeading({ level: format }).run()
}

defineExpose({
  focusDate() {
    datePicker.value?.openAndFocus()
  },
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
    display: flex;
    align-items: flex-start;
    gap: var(--space-8);
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
