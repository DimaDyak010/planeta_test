<template>
  <NuxtLayout name="default">
    <template #action>
      <AppButton
        type="submit"
        form="material-form"
        :loading="saving"
        :aria-label="saving ? 'Сохранение…' : 'Сохранить'"
        square-on-mobile
      >
        Сохранить
        <template #icon>
          <AppIcon name="send" />
        </template>
      </AppButton>
    </template>

    <main class="article-width composer">
      <BackLink class="composer__back" />
      <h1 class="page-title">Создание материала</h1>
      <form id="material-form" class="composer__form" @submit.prevent="save">
        <div class="composer__fields">
          <input v-model="title" class="composer__title" aria-label="Заголовок" placeholder="Введите заголовок"
                 required :maxlength="MATERIAL_LIMITS.title">
          <textarea v-model="summary" class="composer__summary" aria-label="Краткое описание"
                    placeholder="Введите краткое описание…" required :maxlength="MATERIAL_LIMITS.short_description"
                    rows="1" />
        </div>
        <ClientOnly>
          <MaterialEditor ref="editor">
            <template #actions>
              <button
                ref="dateButton"
                class="composer__date-button"
                type="button"
                aria-label="Дата и время создания"
                popovertarget="material-date-picker"
              >
                <AppIcon name="calendar" />
              </button>
              <label id="material-date-picker" class="composer__date-picker" popover="auto">
                Дата и время создания
                <input ref="dateInput" v-model="datetime" type="datetime-local">
              </label>
            </template>
          </MaterialEditor>
        </ClientOnly>
        <p v-if="error" class="composer__error" role="alert">{{ error }}</p>
      </form>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { MATERIAL_LIMITS, type Material } from '#shared/types/material'
import AppButton from '~/components/AppButton.vue'
import AppIcon from '~/components/AppIcon.vue'
import BackLink from '~/components/BackLink.vue'
import MaterialEditor from '~/components/MaterialEditor.client.vue'
import { useMaterials } from '~/composables/useMaterials'

definePageMeta({ layout: false })

useHead({ title: 'Создание материала' })

const title = ref('')
const summary = ref('')
const datetime = ref('')
const dateButton = ref<HTMLButtonElement | null>(null)
const dateInput = ref<HTMLInputElement | null>(null)
const editor = ref<{ getContent: () => { html: string, json: Record<string, unknown> } | null }>()
const saving = ref(false)
const { addMaterial } = useMaterials()
const error = ref('')

onMounted(() => {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  datetime.value = local.toISOString().slice(0, 16)
})

async function save() {
  if (saving.value) return
  error.value = ''
  if (!title.value.trim() || !summary.value.trim()) {
    error.value = 'Введите заголовок и краткое описание.'
    return
  }
  if (title.value.length > MATERIAL_LIMITS.title || summary.value.length > MATERIAL_LIMITS.short_description) {
    error.value = 'Проверьте длину заголовка и краткого описания.'
    return
  }
  const date = new Date(datetime.value)
  if (Number.isNaN(date.getTime())) {
    error.value = 'Укажите дату и время создания.'
    if (!dateInput.value?.closest(':popover-open')) {
      dateButton.value?.focus()
      dateButton.value?.click()
    }
    dateInput.value?.focus()
    return
  }
  const content = editor.value?.getContent()
  if (!content) {
    error.value = 'Введите текст материала.'
    return
  }

  saving.value = true
  try {
    const material = await $fetch<Material>('/api/materials', {
      method: 'POST',
      body: {
        title: title.value,
        short_description: summary.value,
        datetime: date.toISOString(),
        description_html: content.html,
        description_json: content.json,
      },
    })
    addMaterial(material)
    await navigateTo({ name: 'materials-id', params: { id: material.id } })
  } catch {
    error.value = 'Не удалось сохранить материал. Попробуйте ещё раз.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="less">
.composer {
  display: grid;
  justify-items: start;
  gap: var(--space-32);
  padding-block: var(--page-top) var(--space-32);

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
  &__date-button {
    --icon-height: 20px;

    anchor-name: --material-date-button;
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

    &:active, &:has(+ .composer__date-picker:popover-open) {
      background: var(--color-action-hover);
    }
  }

  &__date-picker {
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
      position-anchor: --material-date-button;
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
    }
  }

  &__error {
    color: var(--color-error);
  }
}

@media (hover: hover) {
  .composer__date-button:hover {
    background: var(--color-action-hover);
  }
}

@media (max-width: 600px) {
  .composer {
    &__back {
      display: none;
    }
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
