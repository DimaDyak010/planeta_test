<template>
  <header class="site-header">
    <div class="page-width site-header__inner">
      <NuxtLink class="site-header__brand" to="/">
        <img
          class="site-header__logo"
          :src="logo"
          width="115"
          height="44"
          alt="Моя Планета"
        >
      </NuxtLink>

      <slot name="action" />
    </div>
  </header>
</template>

<script setup lang="ts">
import logo from '~/assets/brand/logo.svg'
</script>

<style scoped lang="less">
.site-header {
  position: sticky;
  z-index: 2;
  top: 0;
  background: var(--color-surface);

  &__inner {
    --icon-height: 28px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 84px;
  }

  &__brand {
    flex: none;
  }

  &__logo {
    display: block;
    width: auto;
    height: 44px;
  }
}

@media (any-pointer: coarse) {
  .site-header__brand {
    -webkit-tap-highlight-color: transparent;
  }
}

@media (max-width: 600px) {
  .site-header__inner {
    height: 64px;
  }

  .site-header__logo {
    height: 36px;
  }
}
</style>
