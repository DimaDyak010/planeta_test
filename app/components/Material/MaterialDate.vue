<template>
  <time
    v-if="label"
    :datetime="datetime"
    class="date"
    :class="`date--${variant}`"
  >
    <AppIcon name="calendar" />
    <span class="date__label">{{ label }}</span>
  </time>
</template>

<script setup lang="ts">
import AppIcon from '~/components/ui/AppIcon.vue'

const { datetime, variant = 'card' } = defineProps<{
  datetime: string
  variant?: 'card' | 'detail'
}>()

const formatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  timeZone: 'Europe/Moscow',
})

const label = computed(() => {
  const date = new Date(datetime)
  return Number.isNaN(date.getTime()) ? '' : formatter.format(date)
})
</script>

<style scoped lang="less">
.date {
  --icon-height: 20px;

  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-muted);
  font-size: 16px;

  &__label {
    line-height: 1;
  }

  &--detail {
    --icon-height: 24px;

    gap: var(--space-12);
    font-size: 20px;

    .date__label {
      line-height: 1.4;
    }
  }
}

@media (max-width: 600px) {
  .date {
    --icon-height: 16px;

    font-size: 14px;
  }
  .date--card {
    min-block-size: 18px;
  }
  .date--detail {
    --icon-height: 20px;

    gap: var(--space-8);
    font-size: 18px;
    font-weight: 500;

    .date__label {
      line-height: 1.2;
    }
  }
}
</style>
