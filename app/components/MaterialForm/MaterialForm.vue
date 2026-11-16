<template>
  <form class="composer__form" novalidate @submit.prevent="submit">
    <div class="composer__fields">
      <input v-model="draft.title" class="composer__title" aria-label="Заголовок" placeholder="Введите заголовок"
             required :maxlength="MATERIAL_LIMITS.title">
      <textarea v-model="draft.summary" class="composer__summary" aria-label="Краткое описание"
                placeholder="Введите краткое описание…" required :maxlength="MATERIAL_LIMITS.short_description"
                rows="1" />
    </div>

    <ClientOnly>
      <MaterialEditor ref="editor" v-model:datetime="draft.datetime" />
    </ClientOnly>

    <p v-if="error" class="composer__error" role="alert">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { MATERIAL_LIMITS, type MaterialInput } from '#shared/types/material'
import MaterialEditor from './MaterialEditor.vue'

const props = defineProps<{ saving: boolean }>()
const emit = defineEmits<{ submit: [material: MaterialInput] }>()
const error = ref('')

const draft = ref({ title: '', summary: '', datetime: '' })
const editor = useTemplateRef('editor')

onMounted(() => {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  draft.value.datetime = local.toISOString().slice(0, 16)
})

function submit() {
  if (props.saving) return
  error.value = ''
  const { title, summary, datetime } = draft.value
  if (!title.trim() || !summary.trim()) {
    error.value = 'Введите заголовок и краткое описание.'
    return
  }
  if (title.length > MATERIAL_LIMITS.title || summary.length > MATERIAL_LIMITS.short_description) {
    error.value = `Заголовок — до ${MATERIAL_LIMITS.title} символов, краткое описание — до ${MATERIAL_LIMITS.short_description}.`
    return
  }
  const date = new Date(datetime)
  if (Number.isNaN(date.getTime())) {
    error.value = 'Укажите дату и время создания.'
    editor.value?.focusDate()
    return
  }
  const content = editor.value?.getContent()
  if (!content) {
    error.value = 'Введите текст материала.'
    return
  }

  emit('submit', {
    title,
    short_description: summary,
    datetime: date.toISOString(),
    description_html: content.html,
    description_json: content.json,
  })
}
</script>

<style scoped lang="less">
.composer {
  &__form :is(input, textarea):focus-visible {
    outline: none;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--space-40);
    width: 100%;
    min-height: 598px;
    margin-block-start: var(--space-16);
    padding: 48px var(--space-24);
    border-radius: var(--radius-panel);
    background: var(--color-surface);
  }

  &__fields {
    display: grid;
    gap: var(--space-24);
    padding-inline-start: 106px;
  }
  &__title, &__summary {
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    &::placeholder {
      color: var(--color-muted);
      opacity: 1;
    }
  }

  &__title {
    font: 600 var(--heading-size) / 1.2 var(--font-heading);
  }
  &__summary {
    font-size: 22px;
    font-weight: 500;
    line-height: 1.2;
    resize: none;
    scrollbar-width: none;
    field-sizing: content;
  }
  &__error {
    color: var(--color-error);
  }
}

@media (max-width: 600px) {
  .composer {
    &__form {
      min-height: 540px;
      margin: 0;
      padding: 20px var(--space-16);
      gap: var(--space-24);
      border-radius: 16px;
    }
    &__fields {
      gap: var(--space-12);
      padding: 0;
    }
    &__summary {
      font-size: 18px;
    }
  }
}
</style>
