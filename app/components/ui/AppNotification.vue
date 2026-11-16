<template>
  <div v-if="notification" class="notification" :class="{ 'notification--error': notification.type === 'error' }">
    <p>{{ notification.message }}</p>
    <button class="notification__close" type="button" aria-label="Закрыть уведомление" @click="dismiss">×</button>
  </div>
  <div class="notification__live" role="status">{{ notification?.type === 'success' ? notification.message : '' }}</div>
  <div class="notification__live" role="alert">{{ notification?.type === 'error' ? notification.message : '' }}</div>
</template>

<script setup lang="ts">
import { useNotifications } from '~/composables/useNotifications'

const { notification, dismiss } = useNotifications()
</script>

<style scoped lang="less">
.notification {
  --notification-accent: var(--color-accent);

  position: fixed;
  z-index: 3;
  top: calc(var(--site-header-height) + var(--space-16));
  right: max(var(--page-gutter), env(safe-area-inset-right));
  display: flex;
  align-items: center;
  gap: var(--space-12);
  width: max-content;
  max-width: min(420px, calc(100% - 2 * var(--page-gutter)));
  margin: 0;
  padding: var(--space-12) var(--space-16);
  border: 0;
  border-inline-start: 4px solid var(--notification-accent);
  border-radius: var(--radius-12);
  background: var(--color-surface);
  box-shadow: var(--card-shadow);
  color: var(--color-text);
  font: 500 18px / 1.3 var(--font-body);

  &--error {
    --notification-accent: var(--color-error);
  }

  &__close {
    flex: none;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    border-radius: 8px;
    background: var(--color-bg);
    font-size: 24px;
    line-height: 1;
  }

  &__live {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
}
</style>
