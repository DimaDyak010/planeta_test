import type { MaterialInput } from '#shared/types/material'
import { useMaterials } from '~/composables/useMaterials'

export function useCreateMaterial() {
  const saving = ref(false)
  const error = ref('')
  const { createMaterial } = useMaterials()

  async function save(body: MaterialInput) {
    if (saving.value) return

    saving.value = true
    try {
      const material = await createMaterial(body)
      await navigateTo({ name: 'materials-id', params: { id: material.id } })
    } catch {
      error.value = 'Не удалось сохранить материал. Попробуйте ещё раз.'
    } finally {
      saving.value = false
    }
  }

  return { saving, error, save }
}
