<template>
  <span class="app-icon" aria-hidden="true" v-html="icons[name]" />
</template>

<script setup lang="ts">
import back from '~/assets/icon/back.svg?raw'
import calendar from '~/assets/icon/calendar.svg?raw'
import plus from '~/assets/icon/plus.svg?raw'
import send from '~/assets/icon/send.svg?raw'
import spinner from '~/assets/icon/spinner.svg?raw'

const icons = {
  back,
  calendar,
  plus,
  send,
  spinner,
}

defineProps<{ name: keyof typeof icons }>()
</script>

<style scoped lang="less">
.app-icon {
  display: inline-flex;
  flex: none;

  :deep(svg) {
    width: auto;
    height: var(--icon-height, 24px);
  }
}
</style>
