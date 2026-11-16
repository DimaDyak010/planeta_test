<template>
  <NuxtLink class="card" :to="`/materials/${encodeURIComponent(material.id)}`">
    <MaterialDate :datetime="material.datetime" />

    <h2 class="card__title">{{ material.title }}</h2>

    <p class="card__description">{{ material.short_description }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Material } from '#shared/types/material'
import MaterialDate from './MaterialDate.vue'

defineProps<{ material: Material }>()
</script>

<style scoped lang="less">
.card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: var(--space-32) var(--space-24);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  text-decoration: none;
  overflow-wrap: anywhere;
  transition: box-shadow .18s ease;

  &:active, &:focus-visible {
    box-shadow: var(--card-shadow);
  }
  &__title {
    font: 600 20px / 1.2 var(--font-heading);
  }
  &__description {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    color: var(--color-secondary);
    font-size: 16px;
    line-height: 1.2;
  }
}

@media (hover: hover) {
  .card:hover {
    box-shadow: var(--card-shadow);
  }
}

@media (max-width: 600px) {
  .card {
    gap: var(--space-16);
    padding: var(--space-24);
    &__title {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      font-size: 18px;
      line-height: 22px;
    }
    &__description {
      font-size: 14px;
      line-height: 18px;
    }
  }
}
</style>
