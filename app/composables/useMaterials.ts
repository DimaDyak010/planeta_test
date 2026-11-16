import type { Material, MaterialInput } from '#shared/types/material'

export function useMaterials() {
  const lastCreated = useState<Material | null>('last-created-material', () => null)

  function loadMaterials() {
    return useFetch<Material[]>('/api/materials', { key: 'materials' })
  }

  async function createMaterial(body: MaterialInput) {
    const material = await $fetch<Material>('/api/materials', {
      method: 'POST',
      body,
    })
    lastCreated.value = material
    clearNuxtData('materials')
    return material
  }

  return { loadMaterials, lastCreated, createMaterial }
}
