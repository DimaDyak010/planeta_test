<template>
  <div>
    <AppHeader>
      <template #action>
        <slot name="action">
          <AppButton to="/materials/new" aria-label="Создать материал" square-on-mobile>
            Создать материал
            <template #icon>
              <AppIcon name="plus" />
            </template>
          </AppButton>
        </slot>
      </template>
    </AppHeader>
    <slot />
  </div>
</template>

<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'
import AppHeader from '~/components/ui/AppHeader.vue'
import AppIcon from '~/components/ui/AppIcon.vue'
</script>
