<template>
  <NuxtLayout name="default">
    <template #action>
      <AppButton
        type="submit"
        form="material-form"
        :loading="saving"
        :aria-label="saving ? 'Сохранение…' : 'Сохранить'"
        square-on-mobile
      >
        Сохранить
        <template #icon>
          <AppIcon name="send" />
        </template>
      </AppButton>
    </template>

    <main class="article-width composer">
      <BackLink class="composer__back" />

      <h1 class="page-title">Создание материала</h1>

      <MaterialForm
        id="material-form"
        v-model:error="error"
        :saving="saving"
        @submit="save"
      />
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import AppButton from '~/components/ui/AppButton.vue'
import AppIcon from '~/components/ui/AppIcon.vue'
import BackLink from '~/components/ui/BackLink.vue'
import MaterialForm from '~/components/MaterialForm/MaterialForm.vue'
import { useCreateMaterial } from '~/components/MaterialForm/composables/useCreateMaterial'

definePageMeta({ layout: false })

useHead({ title: 'Создание материала' })

const { saving, error, save } = useCreateMaterial()
</script>

<style scoped lang="less">
.composer {
  display: grid;
  justify-items: start;
  gap: var(--space-32);
  padding-block: var(--page-top) var(--space-32);
}

@media (max-width: 600px) {
  .composer__back {
    display: none;
  }
}
</style>
