<template>
  <header class="site-header">
    <div class="page-width site-header__inner" />
  </header>
</template>

<style scoped lang="less">
.site-header {
  position: sticky;
  z-index: 2;
  top: 0;
  background: var(--color-surface);

  &__inner {
    height: 84px;
  }
}

@media (max-width: 600px) {
  .site-header__inner {
    height: 64px;
  }
}
</style>
