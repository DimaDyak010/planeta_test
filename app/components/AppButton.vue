<template>
  <component
    :is="element"
    v-bind="elementProps"
    class="app-button"
    :class="{
      'app-button--square': variant === 'square',
      'app-button--square-on-mobile': squareOnMobile,
      'app-button--loading': loading,
    }"
    :aria-busy="loading || undefined"
    @click="handleClick"
  >
    <span class="app-button__content">
      <span v-if="variant === 'text' && $slots.default" class="app-button__label">
        <slot />
      </span>
      <span v-if="$slots.icon" class="app-button__icon" aria-hidden="true">
        <slot name="icon" />
      </span>
    </span>

    <AppIcon v-if="loading" name="spinner" class="app-button__spinner" />
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'
import type { NuxtLinkProps } from 'nuxt/app'
import AppIcon from '~/components/AppIcon.vue'

const props = withDefaults(defineProps<{
  variant?: 'text' | 'square'
  squareOnMobile?: boolean
  type?: 'button' | 'submit' | 'reset'
  to?: NuxtLinkProps['to']
  disabled?: boolean
  loading?: boolean
}>(), {
  variant: 'text',
  type: 'button',
})

const emit = defineEmits<{
  (event: 'click', payload: MouseEvent): void
}>()

const unavailable = computed(() => props.disabled || props.loading)
const element = computed(() => {
  if (!props.to) return 'button'
  return unavailable.value ? 'a' : NuxtLink
})

const elementProps = computed(() => {
  if (!props.to) return { type: props.type, disabled: unavailable.value }
  return unavailable.value
    ? { role: 'link', 'aria-disabled': true }
    : { to: props.to }
})

function handleClick(event: MouseEvent) {
  if (unavailable.value) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>

<style scoped lang="less">
.app-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 44px;
  padding-inline: var(--space-24);
  border: 0;
  border-radius: var(--radius-button);
  background: var(--color-accent-bg);
  color: var(--color-accent);
  font-size: 18px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color var(--transition-duration) ease,
    opacity var(--transition-duration) ease;

  &:not(:disabled, [aria-disabled='true']):active {
    background: var(--color-action-hover);
  }

  &:is(:disabled, [aria-disabled='true']) {
    opacity: .6;
    cursor: default;
  }

  &__content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-8);
  }

  &__icon {
    display: inline-flex;
    flex: none;
  }

  &__spinner {
    --icon-height: 20px;

    position: absolute;
    inset: 0;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  &__spinner :deep(svg) {
    animation: app-button-spin .8s linear infinite;
  }

  &--loading:is(:disabled, [aria-disabled='true']) {
    opacity: 1;
    cursor: wait;
  }

  &--loading &__content {
    opacity: 0;
  }

  &--square {
    width: 48px;
    height: 48px;
    padding: 0;
  }

  &--square &__spinner {
    --icon-height: 24px;
  }

  &--square-on-mobile &__icon {
    display: none;
  }
}

@media (hover: hover) {
  .app-button:not(:disabled, [aria-disabled='true']):hover {
    background: var(--color-action-hover);
  }
}

@media (any-pointer: coarse) {
  .app-button {
    -webkit-tap-highlight-color: transparent;
  }
}

@media (max-width: 600px) {
  .app-button--square-on-mobile {
    width: 48px;
    height: 48px;
    padding: 0;

    .app-button__label {
      display: none;
    }

    .app-button__icon {
      display: inline-flex;
    }

    .app-button__spinner {
      --icon-height: 24px;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-button {
    transition: none;
  }

  .app-button__spinner :deep(svg) {
    animation: none;
  }
}

@keyframes app-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
