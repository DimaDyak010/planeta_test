<template>
  <AppHeader />

  <main class="article-width error-page">
    <div class="error-page__panel">
      <p class="error-page__code">{{ status }}</p>
      <h1 class="page-title">{{ title }}</h1>
      <p class="error-page__description">
        {{ isNotFound ? 'Возможно, страницу удалили или адрес изменился.' : 'Попробуйте вернуться на главную страницу.' }}
      </p>
      <AppButton to="/" class="error-page__action">На главную</AppButton>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import AppButton from '~/components/ui/AppButton.vue'
import AppHeader from '~/components/ui/AppHeader.vue'

const props = defineProps<{ error: NuxtError }>()
const status = computed(() => props.error.status ?? props.error.statusCode)
const isNotFound = computed(() => status.value === 404)
const title = computed(() => isNotFound.value ? 'Страница не найдена' : 'Не удалось открыть страницу')

useHead(() => ({ title: title.value }))
</script>

<style scoped lang="less">
.error-page {
  padding-block: var(--page-top) var(--space-32);

  &__panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-12);
    min-height: 360px;
    padding: var(--space-48) var(--space-24);
    border-radius: var(--radius-panel);
    background: var(--color-surface);
    text-align: center;
  }

  &__code {
    color: var(--color-accent);
    font: 500 72px / 1 var(--font-body);
  }

  &__description {
    color: var(--palette-gray-700);
  }

  &__action {
    margin-block-start: var(--space-12);
  }
}

@media (max-width: 600px) {
  .error-page {
    &__panel {
      min-height: 280px;
      padding: var(--space-32) var(--space-16);
      border-radius: var(--radius-card);
    }

    &__code {
      font-size: 56px;
    }

    &__description {
      font-size: 18px;
    }
  }
}
</style>
