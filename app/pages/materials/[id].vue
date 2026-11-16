<template>
  <main class="article-width detail">
    <BackLink class="detail__back" />

    <article v-if="data" class="detail__panel">
      <header class="detail__heading">
        <MaterialDate :datetime="data.datetime" variant="detail" />
        <h1 class="page-title">{{ data.title }}</h1>
        <p class="detail__summary">{{ data.short_description }}</p>
      </header>

      <div class="detail__content" v-html="data.description_html" />
    </article>
  </main>
</template>

<script setup lang="ts">
import BackLink from '~/components/BackLink.vue'
import MaterialDate from '~/components/MaterialDate.vue'
import { useMaterials } from '~/composables/useMaterials'

const route = useRoute()
const { materials } = useMaterials()
const data = computed(() => materials.value.find(item => String(item.id) === String(route.params.id)))

if (!data.value) throw createError({ statusCode: 404, statusMessage: 'Material not found', fatal: true })
useHead(() => ({ title: data.value?.title ?? 'Материал' }))
</script>

<style scoped lang="less">
.detail {
  display: grid;
  gap: 48px;
  justify-items: start;
  padding-block: var(--page-top) var(--space-32);

  &__panel {
    display: grid;
    gap: 38px;
    width: 100%;
    padding: 64px;
    border-radius: var(--radius-panel);
    background: var(--color-surface);
    overflow-wrap: anywhere;
  }

  &__heading {
    display: grid;
    gap: var(--space-24);
  }
  &__summary {
    font-size: 22px;
    font-weight: 500;
    line-height: 1.2;
  }
  &__content {
    :deep(p + p), :deep(h1), :deep(h2), :deep(h3), :deep(blockquote) {
      margin-block: 1.4em 0;
    }
    :deep(h1), :deep(h2), :deep(h3) {
      font-family: var(--font-heading);
      line-height: 1.2;
    }
    :deep(blockquote) {
      margin-inline: 0;
      padding-inline-start: 1em;
      border-inline-start: 2px solid var(--color-accent);
    }
    > :deep(:first-child) {
      margin-block-start: 0;
    }
    :deep(img) {
      max-width: 100%;
      height: auto;
    }
  }
}

@media (max-width: 600px) {
  .detail {
    width: 100%;
    gap: var(--space-32);
    &__back {
      margin-inline-start: var(--page-gutter);
    }
    &__panel {
      padding: var(--space-24) var(--page-gutter);
      gap: var(--space-24);
      border-radius: var(--radius-card);
    }
    &__summary {
      font-size: 18px;
    }
    &__content {
      font-size: 16px;
    }
  }
}
</style>
