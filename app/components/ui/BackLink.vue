<template>
  <NuxtLink class="back-link" to="/">
    <AppIcon name="back" />
    <span class="back-link__text">Назад</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import AppIcon from '~/components/ui/AppIcon.vue'
</script>

<style scoped lang="less">
.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-12);
  height: 24px;
  color: var(--color-text);
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
  text-decoration: none;
  white-space: nowrap;
  transition: color var(--transition-duration) ease;

  &:active, &:focus-visible {
    color: var(--color-accent);
  }

  &__text {
    position: relative;
    top: -1px;
  }
}

@media (hover: hover) {
  .back-link:hover {
    color: var(--color-accent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link {
    transition: none;
  }
}
</style>
