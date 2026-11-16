import type { Material, MaterialInput } from '#shared/types/material'

export function useMaterials() {
  const lastCreated = useState<Material | null>('last-created-material', () => null)

  function loadMaterials() {
    return useFetch<Material[]>('/api/materials')
  }

  function loadMaterial(id: number) {
    const material = lastCreated.value
    if (material?.id === id) {
      lastCreated.value = null
      return { data: shallowRef(material), error: shallowRef(undefined) }
    }

    return useFetch<Material>(`/api/materials/${id}`)
  }

  async function createMaterial(body: MaterialInput) {
    const material = await $fetch<Material>('/api/materials', {
      method: 'POST',
      body,
    })
    lastCreated.value = material
    return material
  }

  return {
    loadMaterials,
    loadMaterial,
    createMaterial
  }
}
