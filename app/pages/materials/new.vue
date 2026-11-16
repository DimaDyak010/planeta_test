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
        :saving="saving"
        @submit="saveMaterial"
      />
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { MaterialInput } from '#shared/types/material'
import AppButton from '~/components/ui/AppButton.vue'
import AppIcon from '~/components/ui/AppIcon.vue'
import BackLink from '~/components/ui/BackLink.vue'
import MaterialForm from '~/components/MaterialForm/MaterialForm.vue'
import { useCreateMaterial } from '~/components/MaterialForm/composables/useCreateMaterial'
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({ layout: false })

useHead({ title: 'Создание материала' })

const { saving, save } = useCreateMaterial()
const { success, error: notifyError } = useNotifications()

async function saveMaterial(body: MaterialInput) {
  try {
    if (await save(body)) success('Материал сохранён.')
  } catch {
    notifyError('Не удалось сохранить материал. Попробуйте ещё раз.')
  }
}
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
