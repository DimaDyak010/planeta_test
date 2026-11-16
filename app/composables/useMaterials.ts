import type { Material, MaterialInput } from '#shared/types/material'
import { mockMaterials } from '~/mocks/materials'

export function useMaterials() {
  const created = useState<Material[]>('created-materials', () => [])
  const materials = computed(() => {
    const byId = new Map([...mockMaterials, ...created.value].map(material => [String(material.id), material]))
    return [...byId.values()].sort((a, b) => Date.parse(b.datetime) - Date.parse(a.datetime))
  })

  function addMaterial(material: Material) {
    created.value.push(material)
  }

  async function createMaterial(body: MaterialInput) {
    const material = await $fetch<Material>('/api/materials', {
      method: 'POST',
      body,
    })
    addMaterial(material)
    return material
  }

  return { materials, addMaterial, createMaterial }
}
